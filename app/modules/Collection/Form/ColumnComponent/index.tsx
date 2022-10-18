import { useGlobal } from "@/app/context/globalContext";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";

const Container = styled(Box)`
  width: 80%;
  border-width: 2px;
  padding: 2rem;
  overflow-y: auto;
  margin-right: 4rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

const DescriptionInput = styled.input<{ mode: "dark" | "light" }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20,20,20,0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20,20,20,0.7)"};
  font-weight: 400;
`;

type Props = {
  fields: string[];
};

function ColumnComponent({ fields }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");
  const { connectedUser } = useGlobal();
  const { mode } = useTheme();

  const FieldDraggable = (provided: DroppableProvided) => (
    <Box {...provided.droppableProps} ref={provided.innerRef}>
      {fields?.map((field, idx) => {
        if (collection.properties[field]?.isPartOfFormView) {
          return (
            <FieldComponent
              id={field}
              index={idx}
              key={field}
              setIsEditFieldOpen={setIsEditFieldOpen}
              setPropertyName={setPropertyName}
            />
          );
        }
      })}
      {provided.placeholder}
    </Box>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
  ]);

  return (
    <Container borderRadius="2xLarge">
      <Box width="full" height="16" marginBottom="8">
        <Stack direction="vertical">
          <NameInput
            placeholder="Enter name"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={async () => {
              if (connectedUser) {
                const res = await updateFormCollection(collection.id, {
                  name,
                });
                res.id && updateCollection(res);
              }
            }}
          />
          <DescriptionInput
            mode={mode}
            placeholder="Enter description"
            autoFocus
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            onBlur={async () => {
              if (connectedUser) {
                const res = await updateFormCollection(collection.id, {
                  description,
                });
                res.id && updateCollection(res);
              }
            }}
          />
        </Stack>
      </Box>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
      </AnimatePresence>
      <Droppable droppableId="activeFields" type="field">
        {FieldDraggableCallback}
      </Droppable>
    </Container>
  );
}

export default memo(ColumnComponent);
