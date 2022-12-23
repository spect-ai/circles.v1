import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import {
  Box,
  Heading,
  IconCog,
  IconCollection,
  IconPlusSmall,
  Stack,
  Text,
} from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Clock, Grid, List, Trello } from "react-feather";
import { Hidden, Visible } from "react-grid-system";
import { toast } from "react-toastify";
import styled from "styled-components";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import AddView from "../AddView";
import Filtering from "../Filtering";
import Filter from "../Filtering/Filter";
import Sort from "../Filtering/Sort";
import Settings from "../Settings";
import ViewSettings from "../ViewSettings";

export default function ProjectHeading() {
  const {
    localCollection: collection,
    projectViewId,
    setProjectViewId,
    updateCollection,
  } = useLocalCollection();
  const [isAddViewPopupOpen, setIsAddViewPopupOpen] = useState(false);
  const [isAddViewModalOpen, setIsAddViewModalOpen] = useState(false);
  const [viewType, setViewType] = useState("");
  const [isViewSettingsOpen, setIsViewSettingsOpen] = useState(false);
  const [isViewPopoverOpen, setIsViewPopoverOpen] = useState(false);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newViewOrder = Array.from(collection.projectMetadata.viewOrder);
    newViewOrder.splice(source.index, 1);
    newViewOrder.splice(destination.index, 0, draggableId);

    updateCollection({
      ...collection,
      projectMetadata: {
        ...collection.projectMetadata,
        viewOrder: newViewOrder,
      },
    });

    setProjectViewId(draggableId);

    const res = await updateFormCollection(collection.id, {
      projectMetadata: {
        ...collection.projectMetadata,
        viewOrder: newViewOrder,
      },
    });
    if (!res.id) toast.error("Error updating view order");
  };

  return (
    <Box
      paddingX={{
        xs: "2",
        md: "8",
      }}
      paddingTop="4"
    >
      <AnimatePresence>
        {isAddViewModalOpen && (
          <AddView
            viewType={viewType}
            handleClose={() => setIsAddViewModalOpen(false)}
          />
        )}
        {isViewSettingsOpen && (
          <ViewSettings handleClose={() => setIsViewSettingsOpen(false)} />
        )}
      </AnimatePresence>
      <Stack space="0">
        <Stack direction="horizontal" space="2" justify="space-between">
          <Stack direction="horizontal">
            <Heading>{collection.name}</Heading>
            <Settings />
          </Stack>
          <Box width="32">
            <InviteMemberModal />
          </Box>
        </Stack>
        <Box marginBottom="1" />
        <Hidden xs sm>
          <DragDropContext onDragEnd={handleDragEnd}>
            <ViewTabsContainer
              backgroundColor="background"
              paddingX="4"
              borderTopRadius="large"
              display="flex"
              flexDirection="row"
            >
              <Droppable droppableId="Views" direction="horizontal">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    display="flex"
                  >
                    {collection.projectMetadata.viewOrder.map(
                      (viewId, index) => (
                        <Draggable
                          key={viewId}
                          draggableId={viewId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ViewTab
                                paddingX="4"
                                backgroundColor={
                                  viewId === projectViewId
                                    ? "backgroundSecondary"
                                    : "background"
                                }
                                borderTopWidth={
                                  viewId === projectViewId ? "0.375" : "0"
                                }
                                borderRightWidth={
                                  viewId === projectViewId ? "0.375" : "0"
                                }
                                borderLeftWidth={
                                  viewId === projectViewId ? "0.375" : "0"
                                }
                                key={viewId}
                                onClick={() => setProjectViewId(viewId)}
                              >
                                <Text color="accent">
                                  {getViewIcon(
                                    collection.projectMetadata.views[viewId]
                                      ?.type
                                  )}
                                </Text>
                                <Text ellipsis>
                                  {
                                    collection.projectMetadata.views[viewId]
                                      ?.name
                                  }
                                </Text>
                                {viewId === projectViewId && (
                                  <Box
                                    cursor="pointer"
                                    marginLeft="2"
                                    onClick={() => setIsViewSettingsOpen(true)}
                                  >
                                    <Text variant="label">
                                      <IconCog size="5" />
                                    </Text>
                                  </Box>
                                )}
                              </ViewTab>
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>

              <Popover
                isOpen={isAddViewPopupOpen}
                setIsOpen={setIsAddViewPopupOpen}
                butttonComponent={
                  <AddViewButton
                    width="fit"
                    paddingX="8"
                    onClick={() => setIsAddViewPopupOpen(true)}
                  >
                    <Text>
                      <IconPlusSmall size="5" />
                    </Text>
                  </AddViewButton>
                }
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
                  <Box
                    backgroundColor="background"
                    borderWidth="0.375"
                    borderRadius="2xLarge"
                  >
                    <MenuItem
                      padding="2"
                      borderTopRadius="2xLarge"
                      onClick={() => {
                        setIsAddViewPopupOpen(false);
                        setViewType("grid");
                        setIsAddViewModalOpen(true);
                      }}
                    >
                      <Text color="accent">
                        <Grid
                          size={18}
                          style={{
                            marginTop: 4,
                          }}
                        />
                      </Text>
                      <Text weight="semiBold">Grid View</Text>
                    </MenuItem>
                    <MenuItem
                      padding="2"
                      onClick={() => {
                        setIsAddViewPopupOpen(false);
                        setViewType("kanban");
                        setIsAddViewModalOpen(true);
                      }}
                    >
                      <Text color="accent">
                        <Trello />
                      </Text>
                      <Text weight="semiBold">Kanban View</Text>
                    </MenuItem>
                    <MenuItem
                      padding="2"
                      onClick={() => {
                        setIsAddViewPopupOpen(false);
                        setViewType("list");
                        setIsAddViewModalOpen(true);
                      }}
                    >
                      <Text color="accent">
                        <List />
                      </Text>
                      <Text weight="semiBold">List View</Text>
                    </MenuItem>
                    <MenuItem
                      padding="2"
                      borderBottomRadius="2xLarge"
                      onClick={() => {
                        toast.warning("Coming soon!");
                        setIsAddViewPopupOpen(false);
                      }}
                    >
                      <Text color="accent">
                        <Clock />
                      </Text>
                      <Text weight="semiBold">Gantt View</Text>
                    </MenuItem>
                  </Box>
                </motion.div>
              </Popover>
            </ViewTabsContainer>
          </DragDropContext>
          <Filtering />
        </Hidden>
        <Visible xs sm>
          <Stack direction="horizontal">
            <Popover
              width="1/2"
              butttonComponent={
                <PrimaryButton
                  onClick={() => setIsViewPopoverOpen(!isViewPopoverOpen)}
                  variant="tertiary"
                  icon={
                    <Text color="accent">
                      {getViewIcon(
                        collection.projectMetadata.views[projectViewId]?.type
                      )}
                    </Text>
                  }
                >
                  <Text ellipsis>
                    {collection.projectMetadata.views[projectViewId]?.name}
                  </Text>
                </PrimaryButton>
              }
              isOpen={isViewPopoverOpen}
              setIsOpen={setIsViewPopoverOpen}
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
                <Box
                  backgroundColor="background"
                  borderWidth="0.375"
                  borderRadius="2xLarge"
                >
                  {collection.projectMetadata.viewOrder.map((viewId) => (
                    <MenuItem
                      padding="2"
                      borderTopRadius="2xLarge"
                      borderBottomRadius="2xLarge"
                      key={viewId}
                      onClick={() => {
                        setProjectViewId(viewId);
                        setIsViewPopoverOpen(false);
                      }}
                    >
                      <Text color="accent">
                        {getViewIcon(
                          collection.projectMetadata.views[viewId]?.type
                        )}
                      </Text>
                      <Text ellipsis>
                        {collection.projectMetadata.views[viewId]?.name}
                      </Text>
                      {viewId === projectViewId && (
                        <Box
                          cursor="pointer"
                          marginLeft="2"
                          onClick={() => setIsViewSettingsOpen(true)}
                        >
                          <Text variant="label">
                            <IconCog />
                          </Text>
                        </Box>
                      )}
                    </MenuItem>
                  ))}
                </Box>
              </motion.div>
            </Popover>
            <Filter />
            <Sort />
          </Stack>
        </Visible>
      </Stack>
    </Box>
  );
}

export const getViewIcon = (viewType: string) => {
  switch (viewType) {
    case "grid":
      return (
        <Grid
          size={18}
          style={{
            marginTop: 4,
          }}
        />
      );
    case "kanban":
      return (
        <Trello
          size={18}
          style={{
            marginTop: "4px",
          }}
        />
      );
    case "list":
      return (
        <List
          size={18}
          style={{
            marginTop: "4px",
          }}
        />
      );
    case "gantt":
      return (
        <Clock
          size={18}
          style={{
            marginTop: "4px",
          }}
        />
      );
    default:
      return <IconCollection size="5" />;
  }
};

export const ViewTabsContainer = styled(Box)``;

export const ViewTab = styled(Box)`
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const AddViewButton = styled(Box)`
  cursor: pointer;
  transition: background 0.4s ease;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-top: 4px;
`;

const MenuItem = styled(Box)`
  display: flex;
  gap: 8px;
  &:hover {
    background: rgb(191, 90, 242, 0.1);
  }
  cursor: pointer;
  transition: background 0.4s ease;
`;
