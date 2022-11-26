/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import {
  addCollectionData,
  updateFormCollection,
} from "@/app/services/Collection";
import {
  Box,
  IconDotsVertical,
  IconPlusSmall,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddField from "../../Collection/AddField";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import EditProperty from "../EditProperty";
import EditValue from "../EditValue";

type Props = {
  handleClose: () => void;
};

export default function CardDrawer({ handleClose }: Props) {
  const { mode } = useTheme();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [value, setValue] = useState<any>({});

  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination?.index === source.index) {
      return;
    }
    const newPropertyOrder = reorder(
      propertyOrder,
      source.index,
      destination.index
    );
    console.log({ newPropertyOrder });
    setPropertyOrder(newPropertyOrder);

    const res = await updateFormCollection(collection.id, {
      propertyOrder: newPropertyOrder,
    });
    if (res.id) updateCollection(res);
    else toast.error("Something went wrong while updating property order");
  };

  const PropertyDraggable = ({
    provided,
    snapshot,
    property,
    value,
  }: {
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
    property: string;
    value: any;
  }) => {
    const [hover, setHover] = useState(false);
    const usePortal = snapshot.isDragging;
    const child = (
      <Box
        key={property}
        marginY="1"
        ref={provided.innerRef}
        {...provided.draggableProps}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="horizontal" align="center" space="0">
          <Box
            style={{
              marginLeft: "-1rem",
            }}
            marginTop="1"
            {...provided.dragHandleProps}
            display={snapshot.isDragging ? "none" : hover ? "block" : "none"}
          >
            <Text variant="label">
              <IconDotsVertical size="4" />
            </Text>
          </Box>
          <EditProperty propertyName={property} />
          <EditValue
            propertyName={property}
            value={value[property]}
            setValue={(val) => {
              setValue({ ...value, [property]: val });
            }}
          />
        </Stack>
      </Box>
    );

    return usePortal ? ReactDOM.createPortal(child, document.body) : child;
  };

  const PropertyDraggableCallback = useCallback(PropertyDraggable, []);

  const PropertyList = (provided: DroppableProvided) => (
    <Box ref={provided.innerRef} {...provided.droppableProps}>
      {propertyOrder.map((property, index) => {
        if (property !== "Title" && property !== "Description") {
          return (
            <Draggable key={property} draggableId={property} index={index}>
              {(provided, snapshot) => {
                return (
                  <PropertyDraggableCallback
                    provided={provided}
                    property={property}
                    snapshot={snapshot}
                    value={value}
                  />
                );
              }}
            </Draggable>
          );
        }
      })}
      {provided.placeholder}
    </Box>
  );

  const ProperyListCallback = useCallback(PropertyList, [
    PropertyDraggableCallback,
    propertyOrder,
    value,
  ]);

  return (
    <Box>
      <Drawer
        width="50%"
        handleClose={async () => {
          if (Object.keys(value).length > 0) {
            const res = await addCollectionData(collection.id, value);
            if (res.id) handleClose();
            else toast.error("Error adding card");
          } else handleClose();
        }}
      >
        <AnimatePresence>
          {isAddFieldOpen && (
            <AddField handleClose={() => setIsAddFieldOpen(false)} />
          )}
        </AnimatePresence>
        <Box paddingX="8" paddingY="4">
          <Stack space="1">
            <NameInput
              mode={mode}
              placeholder="Untitled"
              value={value.Title}
              onChange={(e) => setValue({ ...value, Title: e.target.value })}
            />
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable" type="PROPERTY">
                {ProperyListCallback}
              </Droppable>
            </DragDropContext>
            <Box width="1/4">
              <PrimaryButton
                variant="tertiary"
                icon={<IconPlusSmall />}
                onClick={() => setIsAddFieldOpen(true)}
              >
                Add Field
              </PrimaryButton>
            </Box>
            <Box padding="2" borderTopWidth="0.375" marginTop="4">
              <Editor
                placeholder="Describe your card here...."
                value={value.Description}
                onSave={(val) => {
                  console.log({ val });
                  setValue({ ...value, Description: val });
                }}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

const NameInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  padding: 8px;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.9rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 700;
  ::placeholder {
    color: ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.1)"
        : "rgb(20, 20, 20, 0.5)"};
  }
  letter-spacing: 0.05rem;
`;
