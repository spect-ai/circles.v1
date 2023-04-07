import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import {
  addCollectionData,
  updateCollectionDataGuarded,
  updateFormCollection,
} from "@/app/services/Collection";
import { Action, MemberDetails } from "@/app/types";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconChevronRight,
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
  defaultValue?: Record<string, unknown>;
};

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

const PropertyDraggable = ({
  provided,
  snapshot,
  property,
  value,
  setValue,
}: {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  property: string;
  value: Record<string, unknown>;
  setValue: (val: Record<string, unknown>) => void;
}) => {
  const [hover, setHover] = useState(false);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { query } = useRouter();
  const { cardSlug } = query;
  const usePortal = snapshot.isDragging;

  const onChange = async (update: Record<string, unknown>, slug: string) => {
    if (slug) {
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
      const res = await updateCollectionDataGuarded(
        collection.id,
        slug,
        update
      );
      if (!res) {
        updateCollection(tempColl);
        return;
      }
      if (res.id) {
        updateCollection(res);
      } else toast.error(res.error || "Error updating card");
    }
  };
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
        <EditProperty
          propertyName={property}
          disabled={
            collection.data?.[cardSlug as string]?.__cardStatus__ === "closed"
          }
        />
        <EditValue
          propertyName={property}
          value={value[property]}
          setValue={(val) => {
            setValue({ ...value, [property]: val });
            onChange({ [property]: val }, value.slug as string);
          }}
          dataId={value.slug as string}
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

const CardDrawer = ({ handleClose, defaultValue }: Props) => {
  const { mode } = useTheme();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [value, setValue] = useState<Record<string, unknown>>(
    defaultValue || {
      Title: "",
      Description: "",
      slug: "",
    }
  );
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
    (id: string) => memberDetails?.memberDetails[id],
    [memberDetails]
  );

  const onChange = async (update: Record<string, unknown>, slug: string) => {
    if (slug) {
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
      const res = await updateCollectionDataGuarded(
        collection.id,
        slug,
        update
      );
      if (!res) {
        updateCollection(tempColl);
        return;
      }
      if (res.id) {
        updateCollection(res);
      } else toast.error(res.error || "Error updating card");
    }
  };

  useEffect(() => {
    setPropertyOrder(collection.propertyOrder);
  }, [collection.propertyOrder]);

  useEffect(() => {
    if (cardSlug) {
      if (isDirty) {
        onChange(
          {
            Description: value.Description,
            Title: value.Title,
          },
          value.slug as string
        );
      }
      setValue({});
      setTimeout(() => {
        setValue(collection.data[cardSlug as string]);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue?.id, cardSlug, newCard]);

  const closeCard = () => {
    push({
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

  const PropertyDraggableCallback = useCallback(PropertyDraggable, [
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
              <Stack space="1">
                <Stack
                  direction="horizontal"
                  justify="space-between"
                  align="center"
                >
                  <NameInput
                    mode={mode}
                    placeholder="Untitled"
                    value={value.Title as string}
                    onChange={(e) => {
                      setIsDirty(true);
                      setValue({ ...value, Title: e.target.value || "" });
                    }}
                    onBlur={async () => {
                      if (isDirty) {
                        await onChange(
                          { Title: value.Title },
                          value.slug as string
                        );
                        setIsDirty(false);
                      }
                    }}
                    disabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
                  />
                  {(value.slug as string) && (
                    <CardOptions
                      handleDrawerClose={closeCard}
                      cardSlug={value.slug as string}
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

                  {(value.slug as string) &&
                    collection.projectMetadata?.paymentStatus?.[
                      value.slug as string
                    ] === "completed" && (
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

                  {(value.slug as string) &&
                    ["pending", "pendingSignature"].includes(
                      collection.projectMetadata?.paymentStatus?.[
                        value.slug as string
                      ] || ""
                    ) && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="2"
                        cursor="pointer"
                        onClick={() => {
                          if (
                            collection.projectMetadata?.paymentIds?.[
                              value.slug as string
                            ]
                          ) {
                            push({
                              pathname: "/[circle]",
                              query: {
                                circle: query.circle,
                                tab: "payment",
                                status: "pending",
                                paymentId:
                                  collection.projectMetadata?.paymentIds?.[
                                    value.slug as string
                                  ],
                              },
                            });
                          }
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
                    collection.discordThreadRef[value.slug as string] && (
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
                            if (
                              collection.discordThreadRef[value.slug as string]
                                .private
                            ) {
                              window.open(
                                `https://discord.com/channels/${
                                  collection.discordThreadRef[
                                    value.slug as string
                                  ].guildId
                                }/${
                                  collection.discordThreadRef[
                                    value.slug as string
                                  ].threadId
                                }`,
                                "_blank"
                              );
                            } else {
                              window.open(
                                `https://discord.com/channels/${
                                  collection.discordThreadRef[
                                    value.slug as string
                                  ].guildId
                                }/${
                                  collection.discordThreadRef[
                                    value.slug as string
                                  ].channelId
                                }/threads/${
                                  collection.discordThreadRef[
                                    value.slug as string
                                  ].threadId
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
                    {(provided) => (
                      <Box ref={provided.innerRef} {...provided.droppableProps}>
                        {propertyOrder.map((property, index) => {
                          if (
                            property !== "Title" &&
                            property !== "Description" &&
                            property !== "__cardStatus__"
                          ) {
                            return (
                              <Draggable
                                key={property}
                                draggableId={property}
                                index={index}
                              >
                                {(provided2, snapshot) => (
                                  <PropertyDraggableCallback
                                    provided={provided2}
                                    property={property}
                                    snapshot={snapshot}
                                    value={value}
                                    setValue={setValue}
                                  />
                                )}
                              </Draggable>
                            );
                          }
                          return null;
                        })}
                        {provided.placeholder}
                      </Box>
                    )}
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
                    icon={<IconPlusSmall size="5" />}
                    onClick={() => setIsAddFieldOpen(true)}
                    disabled={
                      collection.data?.[cardSlug as string]?.__cardStatus__ ===
                      "closed"
                    }
                  >
                    Add Field
                  </PrimaryButton>
                </Box>
                <Box padding="2" borderBottomWidth="0.375" marginTop="4">
                  <Editor
                    placeholder="Describe your card here...."
                    value={value.Description as string}
                    onSave={(val) => {
                      onChange({ Description: val }, value.slug as string);
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
                <Box marginY="3">
                  {/* {!collection.voting?.periods?.[cardSlug as string]?.snapshot
                    ?.onSnapshot && <SpectVoting dataId={cardSlug as string} />} */}
                  {collection.voting?.snapshot?.[cardSlug as string]
                    ?.proposalId && (
                    <SnapshotVoting dataId={cardSlug as string} />
                  )}
                </Box>

                {!newCard && (
                  <CardActivity
                    activities={collection.dataActivities[value.slug as string]}
                    activityOrder={
                      collection.dataActivityOrder[value.slug as string]
                    }
                    dataId={value.slug as string}
                    collectionId={collection.id}
                    dataOwner={
                      collection.profiles[
                        collection.dataOwner[value.slug as string]
                      ]
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
              data={collection.data?.[value.slug as string]}
              dataId={value.slug as string}
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
                  action={{} as Action}
                  setAction={() => {}}
                  manualAction
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
};

CardDrawer.defaultProps = {
  defaultValue: null,
};

export default CardDrawer;
