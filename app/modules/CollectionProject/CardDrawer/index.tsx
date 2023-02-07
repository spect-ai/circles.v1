/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import {
  addCollectionData,
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { MemberDetails, Option } from "@/app/types";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconChevronRight,
  IconDotsVertical,
  IconPlusSmall,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
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
import { Save } from "react-feather";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddField from "../../Collection/AddField";
import { SnapshotModal } from "../../Collection/Common/SnapshotModal";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import SnapshotVoting from "../../Collection/Form/DataDrawer/VotingOnSnapshot";
import CardActivity from "../CardActivity";
import EditProperty from "../EditProperty";
import EditValue from "../EditValue";
import CardOptions from "./CardOptions";

type Props = {
  handleClose: () => void;
  defaultValue?: any;
};

export default function CardDrawer({ handleClose, defaultValue }: Props) {
  const { mode } = useTheme();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [value, setValue] = useState<any>(defaultValue || {});
  const [snapshotModal, setSnapshotModal] = useState(false);

  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);
  const [loading, setLoading] = useState(false);
  const { push, pathname, query } = useRouter();
  const { cardSlug, newCard, circle: cId } = query;

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );

  useEffect(() => {
    setPropertyOrder(collection.propertyOrder);
  }, [collection.propertyOrder]);

  useEffect(() => {
    if (cardSlug) {
      if (isDirty) {
        void onChange(
          {
            Description: value.Description,
            Title: value.Title,
          },
          value.slug
        );
      }
      setValue({});
      setTimeout(() => {
        setValue(collection.data[cardSlug as string]);
      }, 100);
    }
  }, [defaultValue?.id, cardSlug, newCard]);

  const onChange = async (update: any, slug: string) => {
    if (slug) {
      let res;
      // update collection locally
      const tempColl = { ...collection };
      updateCollection({
        ...collection,
        data: {
          ...collection.data,
          [slug]: {
            ...collection.data[slug],
            ...update,
          },
        },
      });
      res = await updateCollectionDataGuarded(collection.id, slug, update);
      if (!res) {
        updateCollection(tempColl);
      }
      if (res.id) {
        updateCollection(res);
      } else toast.error(res.error || "Error updating card");
    }
  };

  const closeCard = () => {
    void push({
      pathname,
      query: {
        circle: query.circle,
        collection: query.collection,
      },
    });
    handleClose();
  };

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
          {/* <Box
            display="flex"
            flexDirection={{
              xs: "row",
              md: "column",
              lg: "row",
            }}
            width="full"
          > */}
          <EditProperty propertyName={property} />
          <EditValue
            propertyName={property}
            value={value[property]}
            setValue={(val) => {
              setValue({ ...value, [property]: val });
              void onChange({ [property]: val }, value.slug);
            }}
            dataId={value.slug}
          />
          {/* </Box> */}
        </Stack>
      </Box>
    );

    return usePortal ? ReactDOM.createPortal(child, document.body) : child;
  };

  const PropertyDraggableCallback = useCallback(PropertyDraggable, [
    collection,
  ]);

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
    collection,
  ]);

  return (
    <Box>
      <Drawer
        width="50%"
        handleClose={handleClose}
        header={
          <Box marginLeft="-4">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Button
                shape="circle"
                size="small"
                variant="transparent"
                onClick={() => {
                  closeCard();
                }}
              >
                <Stack direction="horizontal" align="center" space="0">
                  <IconChevronRight />
                  <Box marginLeft="-4">
                    <IconChevronRight />
                  </Box>
                </Stack>
              </Button>
              <Box width="56">
                {newCard && (
                  <PrimaryButton
                    loading={loading}
                    icon={<Save size="22" />}
                    disabled={Object.keys(value).length === 0}
                    onClick={async () => {
                      setLoading(true);
                      const res = await addCollectionData(collection.id, value);
                      setLoading(false);
                      if (res.id) {
                        updateCollection(res);
                        closeCard();
                      } else toast.error("Error adding card");
                    }}
                  >
                    Create Card
                  </PrimaryButton>
                )}
              </Box>
            </Stack>
          </Box>
        }
      >
        <AnimatePresence>
          {isAddFieldOpen && (
            <AddField handleClose={() => setIsAddFieldOpen(false)} />
          )}
        </AnimatePresence>
        {(value.slug || newCard) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Container paddingX="8" paddingY="4" overflow="auto">
              {value.slug &&
                ["pending", "pendingSignature"].includes(
                  collection.projectMetadata?.paymentStatus?.[value.slug] || ""
                ) && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    marginRight="4"
                    gap="2"
                    cursor="pointer"
                    onClick={() => {
                      if (collection.projectMetadata?.paymentIds?.[value.slug])
                        push({
                          pathname: "/[circle]",
                          query: {
                            circle: query.circle,
                            tab: "payment",
                            status: "pending",
                            paymentId:
                              collection.projectMetadata?.paymentIds?.[
                                value.slug
                              ],
                          },
                        });
                    }}
                  >
                    {" "}
                    <Text color="yellow">
                      <ClockCircleOutlined />
                    </Text>
                    <Text variant="small">Pending Payment</Text>
                  </Box>
                )}
              {value.slug &&
                collection.projectMetadata?.paymentStatus?.[value.slug] ===
                  "completed" && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    marginRight="4"
                    gap="2"
                  >
                    <Text color="green">
                      <CheckCircleOutlined />
                    </Text>

                    <Text variant="small">Payment Completed</Text>
                  </Box>
                )}
              <Stack space="1">
                <Stack
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                >
                  <NameInput
                    mode={mode}
                    placeholder="Untitled"
                    value={value.Title}
                    onChange={(e) => {
                      setIsDirty(true);
                      setValue({ ...value, Title: e.target.value || "" });
                    }}
                    onBlur={async () => {
                      if (isDirty) {
                        await onChange({ Title: value.Title }, value.slug);
                        setIsDirty(false);
                      }
                    }}
                  />
                  {value.slug && (
                    <CardOptions
                      handleDrawerClose={closeCard}
                      cardSlug={value.slug}
                      setSnapshotModal={setSnapshotModal}
                    />
                  )}
                </Stack>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="droppable" type="PROPERTY">
                    {ProperyListCallback}
                  </Droppable>
                </DragDropContext>
                <Box
                  width={{
                    xs: "full",
                    md: "1/3",
                  }}
                >
                  <PrimaryButton
                    variant="tertiary"
                    icon={<IconPlusSmall size={"5"} />}
                    onClick={() => setIsAddFieldOpen(true)}
                  >
                    Add Field
                  </PrimaryButton>
                </Box>
                <Box padding="2" borderBottomWidth="0.375" marginTop="4">
                  <Editor
                    placeholder="Describe your card here...."
                    value={value.Description}
                    onSave={(val) => {
                      void onChange({ Description: val }, value.slug);
                    }}
                    onChange={(val) => {
                      setIsDirty(true);
                      setValue({ ...value, Description: val || "" });
                    }}
                    isDirty={isDirty}
                    setIsDirty={setIsDirty}
                  />
                </Box>
                <Box marginY={"3"}>
                  {/* {!collection.voting?.periods?.[cardSlug as string]?.snapshot
                    ?.onSnapshot && <SpectVoting dataId={cardSlug as string} />} */}
                  {collection.voting?.snapshot?.[cardSlug as string]
                    ?.proposalId && (
                    <SnapshotVoting dataId={cardSlug as string} />
                  )}
                </Box>

                {!newCard && (
                  <CardActivity
                    activities={collection.dataActivities[value.slug]}
                    activityOrder={collection.dataActivityOrder[value.slug]}
                    dataId={value.slug}
                    collectionId={collection.id}
                    dataOwner={
                      collection.profiles[collection.dataOwner[value.slug]]
                    }
                    getMemberDetails={getMemberDetails}
                  />
                )}
              </Stack>
            </Container>
          </motion.div>
        )}
        <AnimatePresence>
          {snapshotModal && (
            <SnapshotModal
              data={collection.data?.[value.slug]}
              dataId={value.slug}
              setSnapshotModal={setSnapshotModal}
            />
          )}
        </AnimatePresence>
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

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  height: calc(100vh - 4rem);
`;
