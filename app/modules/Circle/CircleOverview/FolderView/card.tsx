import Popover from "@/app/common/components/Popover";
import { getViewIcon } from "@/app/modules/CollectionProject/Heading";
import { duplicateCollection } from "@/app/services/Collection";
import { CircleType, UserType } from "@/app/types";
import {
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
  setMoveModalOpen: (value: boolean) => void;
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
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const { circle: cId } = router.query;

  const { circle, fetchCircle } = useCircle();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
        {workstreams?.[card]?.id && (
          <>
            <Stack
              direction={"horizontal"}
              align="center"
              justify={"flex-start"}
            >
              <Box display={"block"}>
                <IconUserGroup size={"5"} />
              </Box>
              <Text ellipsis variant="base" weight={"semiBold"}>
                {workstreams?.[card]?.name}
              </Text>
            </Stack>
            <Box paddingTop={"2"}>
              <Text color={"textSecondary"} ellipsis>
                {workstreams?.[card]?.description}
              </Text>
            </Box>
          </>
        )}
        {collections?.[card]?.id && (
          <Stack
            direction={"horizontal"}
            align="flex-start"
            justify={"space-between"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              onClick={() => {}}
              gap="4"
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
                  <Box backgroundColor="background">
                    <MenuContainer>
                      <Stack space="0">
                        <MenuItem
                          padding="2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPopoverOpen(false);
                            duplicateCollection(
                              collections?.[card]?.slug,
                              collections?.[card]?.collectionType
                            )
                              .then((res) => {
                                fetchCircle();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        >
                          <Stack direction="horizontal" align="center">
                            <Text align="center">
                              <IconCopy size="5" />
                            </Text>
                            <Text align="center">Duplicate</Text>
                          </Stack>
                        </MenuItem>
                      </Stack>
                    </MenuContainer>
                  </Box>
                </motion.div>
              </Popover>
            </Box>
          </Stack>
        )}
      </Container>
    );
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    card,
    workstreams,
    mode,
    setMoveModalOpen,
  ]);

  return (
    <Draggable draggableId={card} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Card);

const MenuContainer = styled(Box)`
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
