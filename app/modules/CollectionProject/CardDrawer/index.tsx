/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { logError, reorder } from "@/app/common/utils/utils";
import {
  addCollectionData,
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { Action, MemberDetails, Option } from "@/app/types";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  InfoOutlined,
} from "@ant-design/icons";
import {
  Box,
  Button,
  IconChevronRight,
  IconClose,
  IconDotsVertical,
  IconLockClosed,
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
import { BsArrowUpRight } from "react-icons/bs";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddField from "../../Collection/AddField";
import CreateDiscordThread from "../../Collection/Automation/Actions/CreateDiscordThread";
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
  const [discordThreadModal, setDiscordThreadModal] = useState(false);

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
        setValue(collection.data?.[cardSlug as string]);
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
            ...collection.data?.[slug],
            ...update,
          },
        },
      });
      res = await updateCollectionDataGuarded(collection.id, slug, update);
      if (!res) {
        updateCollection(tempColl);
        return;
      }
      if (res.id) {
        updateCollection(res);
      } else {
        logError(res.message || "Error updating card");
      }
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
    else logError("Something went wrong while updating property order");
  };

  const PropertyDraggable = ({
    provided,
    snapshot,
    propertyId,
    value,
  }: {
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
    propertyId: string;
    value: any;
  }) => {
    const [hover, setHover] = useState(false);
    const usePortal = snapshot.isDragging;
    const child = (
      <Box
        key={propertyId}
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
          <EditProperty
            propertyId={propertyId}
            disabled={
              collection.data?.[cardSlug as string]?.__cardStatus__ === "closed"
            }
          />
          <EditValue
            propertyId={propertyId}
            value={value[propertyId]}
            setValue={(val) => {
              setValue({ ...value, [propertyId]: val });
              void onChange({ [propertyId]: val }, value.slug);
            }}
            dataId={value.slug}
            disabled={
              collection.data?.[cardSlug as string]?.__cardStatus__ === "closed"
            }
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
      {propertyOrder.map((propertyId, index) => {
        if (
          propertyId !== "Title" &&
          propertyId !== "Description" &&
          propertyId !== "__cardStatus__"
        ) {
          return (
            <Draggable key={propertyId} draggableId={propertyId} index={index}>
              {(provided, snapshot) => {
                return (
                  <PropertyDraggableCallback
                    provided={provided}
                    propertyId={propertyId}
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
                      } else logError(res.message || "Error adding card");
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
                    disabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
                  />

                  {value.slug && (
                    <CardOptions
                      handleDrawerClose={closeCard}
                      cardSlug={value.slug}
                      setSnapshotModal={setSnapshotModal}
                      onChange={onChange}
                      setDiscordThreadModal={setDiscordThreadModal}
                    />
                  )}
                </Stack>
                <Stack direction="horizontal" space="1">
                  {collection.data?.[cardSlug as string]?.__cardStatus__ ===
                    "closed" && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      gap="2"
                    >
                      <CircularBox
                        display="flex"
                        flexDirection="row"
                        mode={mode}
                        gap="2"
                      >
                        <Text color="accent">
                          <IconLockClosed />
                        </Text>
                        <Text variant="small">This card is closed</Text>
                      </CircularBox>
                    </Box>
                  )}

                  {value.slug &&
                    collection.projectMetadata?.paymentStatus?.[value.slug] ===
                      "completed" && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="2"
                      >
                        <CircularBox
                          display="flex"
                          flexDirection="row"
                          mode={mode}
                          gap="2"
                        >
                          <Text color="green">
                            <CheckCircleOutlined />
                          </Text>

                          <Text variant="small">Payment Completed</Text>
                        </CircularBox>
                      </Box>
                    )}

                  {value.slug &&
                    ["pending", "pendingSignature"].includes(
                      collection.projectMetadata?.paymentStatus?.[value.slug] ||
                        ""
                    ) && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="2"
                        cursor="pointer"
                        onClick={() => {
                          if (
                            collection.projectMetadata?.paymentIds?.[value.slug]
                          )
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
                        <CircularBox
                          display="flex"
                          flexDirection="row"
                          mode={mode}
                          gap="2"
                        >
                          {" "}
                          <Text color="yellow">
                            <ClockCircleOutlined />
                          </Text>
                          <Text variant="small">Pending Payment</Text>
                        </CircularBox>
                      </Box>
                    )}

                  {collection.discordThreadRef &&
                    collection.discordThreadRef[value.slug] && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        width="full"
                      >
                        <CircularBox
                          display="flex"
                          flexDirection="row"
                          mode={mode}
                          gap="2"
                          onClick={() => {
                            if (collection.discordThreadRef[value.slug].private)
                              window.open(
                                `https://discord.com/channels/${
                                  collection.discordThreadRef[value.slug]
                                    .guildId
                                }/${
                                  collection.discordThreadRef[value.slug]
                                    .threadId
                                }`,
                                "_blank"
                              );
                            else {
                              window.open(
                                `https://discord.com/channels/${
                                  collection.discordThreadRef[value.slug]
                                    .guildId
                                }/${
                                  collection.discordThreadRef[value.slug]
                                    .channelId
                                }/threads/${
                                  collection.discordThreadRef[value.slug]
                                    .threadId
                                }`,
                                "_blank"
                              );
                            }
                          }}
                        >
                          <Text variant="small">Linked Discord thread</Text>
                          <Text color="accent">
                            <BsArrowUpRight />
                          </Text>
                        </CircularBox>
                      </Box>
                    )}
                </Stack>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="droppable"
                    type="PROPERTY"
                    isDropDisabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
                  >
                    {ProperyListCallback}
                  </Droppable>
                </DragDropContext>
                <Box
                  width={{
                    xs: "full",
                    md: "1/4",
                  }}
                >
                  <PrimaryButton
                    variant="tertiary"
                    icon={<IconPlusSmall size={"5"} />}
                    onClick={() => setIsAddFieldOpen(true)}
                    disabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
                    size="extraSmall"
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
                    disabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
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

                {!newCard &&
                  collection.dataActivities &&
                  collection.dataActivityOrder && (
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
        <AnimatePresence>
          {discordThreadModal && (
            <Modal
              title="Link Discord Thread"
              handleClose={() => {
                setDiscordThreadModal(false);
              }}
              size="small"
            >
              <Box paddingX="8" paddingY="4">
                <CreateDiscordThread
                  collection={collection}
                  actionMode="create"
                  action={{} as Action}
                  setAction={() => {}}
                  manualAction={true}
                  handleClose={() => {
                    setDiscordThreadModal(false);
                  }}
                />
              </Box>
            </Modal>
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

export const CircularBox = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.3rem 0.3rem;
  justify-content: center;
  align-items: center;
  width: 12rem;
`;
