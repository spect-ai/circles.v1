import Popover from "@/app/common/components/Popover";
import { getViewIcon } from "@/app/modules/CollectionProject/Heading";
import { duplicateCollection, moveCollection } from "@/app/services/Collection";
import { CircleType, UserType } from "@/app/types";
import {
  Avatar,
  Box,
  Button,
  IconCopy,
  IconUserGroup,
  Stack,
  Text,
  useTheme,
} from "degen";
import { motion } from "framer-motion";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/router";
import { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Table } from "react-feather";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../../CircleContext";
import { useProviderLocalProfile } from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import { MdOutlineDriveFileMove } from "react-icons/md";
import Logo from "@/app/common/components/Logo";
import { duplicateCircle, moveCircle } from "@/app/services/Circle";

interface Props {
  card: string;
  index: number;
  workstreams?: {
    [key: string]: CircleType;
  };
  collections?: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
}

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-width: 1px;
  border-color: ${(props) =>
    props.isDragging
      ? "rgb(191, 90, 242, 1)"
      : props.mode === "dark"
      ? "rgb(255, 255, 255, 0.05)"
      : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  color: rgb(191, 90, 242, 0.7);
  width: 20rem;
  height: 6rem;
  overflow-x: hidden;
`;

const Card = ({ card, index, workstreams, collections }: Props) => {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { myCircles } = useProviderLocalProfile();
  const { circle, fetchCircle } = useCircle();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isMovePopoverOpen, setIsMovePopoverOpen] = useState(false);

    return (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        padding="4"
        borderRadius="large"
        isDragging={snapshot.isDragging}
        mode={mode}
        position="relative"
        onClick={() => {
          if (workstreams?.[card]?.slug) {
            void router.push(`/${workstreams?.[card]?.slug}`);
          }
          if (collections?.[card]?.slug) {
            process.env.NODE_ENV === "production" &&
              mixpanel.track(`Collection clicked`, {
                circle: circle?.slug,
                form: collections?.[card]?.slug,
                user: currentUser?.username,
              });
            void router.push(`/${cId}/r/${collections?.[card]?.slug}`);
          }
        }}
      >
        <Stack
          direction={"horizontal"}
          align="flex-start"
          justify={"space-between"}
        >
          {workstreams?.[card]?.id && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              onClick={() => {}}
              gap="4"
              style={{ maxWidth: "80%" }}
            >
              <Box display={"block"}>
                <IconUserGroup size={"5"} />
              </Box>
              <Text ellipsis variant="base" weight={"semiBold"}>
                {workstreams?.[card]?.name}
              </Text>
            </Box>
          )}
          {collections?.[card]?.id && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              onClick={() => {}}
              gap="4"
              style={{ maxWidth: "80%" }}
            >
              <Box display={"block"}>
                {collections?.[card].viewType ? (
                  getViewIcon(collections?.[card].viewType || "")
                ) : (
                  <Table size={18} style={{ marginTop: 4 }} />
                )}
              </Box>
              <Text ellipsis variant="base" weight={"semiBold"}>
                {collections?.[card]?.name}
              </Text>
            </Box>
          )}
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"flex-start"}
            justifyContent={"flex-end"}
            gap="4"
          >
            <Popover
              butttonComponent={
                <Box
                  className="collection-duplicate-button"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopoverOpen(true);
                  }}
                >
                  <Button
                    shape="circle"
                    variant="transparent"
                    size="extraSmall"
                  >
                    <Text size="base">
                      <BiDotsVerticalRounded size="20" />
                    </Text>
                  </Button>
                </Box>
              }
              isOpen={isPopoverOpen}
              setIsOpen={(isOpen) => {
                setIsPopoverOpen(isOpen);
                setIsMovePopoverOpen(false);
              }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto", transition: { duration: 0.2 } }}
                exit={{ height: 0 }}
                style={{
                  overflow: "hidden",
                  borderRadius: "0.25rem",
                }}
              >
                {!isMovePopoverOpen && (
                  <Box backgroundColor="background">
                    <MenuContainer>
                      <Stack space="0">
                        <MenuItem
                          padding="2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPopoverOpen(false);
                            if (workstreams?.[card]?.slug) {
                              duplicateCircle(
                                cId as string,
                                workstreams?.[card]?.slug
                              )
                                .then((res) => {
                                  fetchCircle();
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            } else if (collections?.[card]?.slug) {
                              duplicateCollection(
                                collections?.[card]?.slug,
                                collections?.[card]?.collectionType,
                                cId as string
                              )
                                .then((res) => {
                                  fetchCircle();
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }
                          }}
                        >
                          <Stack direction="horizontal" align="center">
                            <Text align="center">
                              <IconCopy size="5" />
                            </Text>
                            <Text align="center">Duplicate</Text>
                          </Stack>
                        </MenuItem>
                        <MenuItem
                          padding="2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMovePopoverOpen(true);
                          }}
                        >
                          <Stack direction="horizontal" align="center">
                            <Text align="center" color="textSecondary">
                              <MdOutlineDriveFileMove size={22} />
                            </Text>
                            <Text align="center">Move</Text>
                          </Stack>
                        </MenuItem>
                      </Stack>
                    </MenuContainer>
                  </Box>
                )}
                {isMovePopoverOpen && (
                  <Box backgroundColor="background">
                    <MenuContainer>
                      <Stack space="0">
                        {myCircles
                          ?.filter((circle) => circle.slug !== cId)
                          ?.map((circle) => {
                            return (
                              <MenuItem
                                padding="2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPopoverOpen(false);
                                  setIsMovePopoverOpen(false);
                                  if (workstreams?.[card]?.slug) {
                                    moveCircle(circle.id, cId as string)
                                      .then((res) => {
                                        fetchCircle();
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  } else if (collections?.[card]?.slug) {
                                    moveCollection(
                                      collections?.[card]?.slug,
                                      cId as string,
                                      circle.id
                                    )
                                      .then((res) => {
                                        fetchCircle();
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  }
                                }}
                              >
                                <Stack
                                  direction="horizontal"
                                  align="center"
                                  justify={"flex-start"}
                                  space="2"
                                >
                                  <Logo
                                    href={``}
                                    src={circle.avatar}
                                    gradient={circle.gradient}
                                    name={circle.name}
                                    size={"7"}
                                  />
                                  <Text>{circle.name}</Text>
                                </Stack>
                              </MenuItem>
                            );
                          })}
                      </Stack>
                    </MenuContainer>
                  </Box>
                )}
              </motion.div>
            </Popover>
          </Box>
        </Stack>
      </Container>
    );
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    card,
    workstreams,
    mode,
  ]);

  return (
    <Draggable draggableId={card} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Card);

const MenuContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 2px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 12rem;
  width: 10.5rem;
  background: rgb(191, 90, 242, 0.05);
  transition: all 0.15s ease-out;
`;

const MenuItem = styled(Box)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }
  transition: background 0.2s ease;
`;
