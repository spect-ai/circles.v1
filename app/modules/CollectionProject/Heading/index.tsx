import Popover from "@/app/common/components/Popover";
import { Box, Heading, IconPlus, IconPlusSmall, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Clock, Grid, List, Trello } from "react-feather";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import AddView from "../AddView";

export default function ProjectHeading() {
  const {
    localCollection: collection,
    projectViewId,
    setProjectViewId,
  } = useLocalCollection();
  const [isAddViewPopupOpen, setIsAddViewPopupOpen] = useState(false);
  const [isAddViewModalOpen, setIsAddViewModalOpen] = useState(false);
  const [viewType, setViewType] = useState("");
  return (
    <Box paddingX="8" paddingTop="4">
      <AnimatePresence>
        {isAddViewModalOpen && (
          <AddView
            viewType={viewType}
            handleClose={() => setIsAddViewModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <Stack>
        <Stack direction="horizontal">
          <Heading>{collection.name}</Heading>
        </Stack>
        <ViewTabsContainer backgroundColor="background" paddingX="4">
          {collection.projectMetadata.viewOrder.map((viewId) => (
            <ViewTab
              paddingX="4"
              backgroundColor={
                viewId === projectViewId ? "backgroundSecondary" : "background"
              }
              borderTopWidth={viewId === projectViewId ? "0.375" : "0"}
              borderRightWidth={viewId === projectViewId ? "0.375" : "0"}
              borderLeftWidth={viewId === projectViewId ? "0.375" : "0"}
              key={viewId}
              onClick={() => setProjectViewId(viewId)}
            >
              <Text color="accent">
                {getViewIcon(collection.projectMetadata.views[viewId].type)}
              </Text>
              <Text>{collection.projectMetadata.views[viewId].name}</Text>
            </ViewTab>
          ))}

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
                  <IconPlusSmall />
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
                    <Grid />
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
                    toast.warning("Coming soon!");
                    setIsAddViewPopupOpen(false);
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
      </Stack>
    </Box>
  );
}

const getViewIcon = (viewType: string) => {
  switch (viewType) {
    case "grid":
      return (
        <Grid
          size={18}
          style={{
            marginTop: "4px",
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
      return (
        <Grid
          size={18}
          style={{
            marginTop: "4px",
          }}
        />
      );
  }
};

export const ViewTabsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const ViewTab = styled(Box)`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const AddViewButton = styled(Box)`
  &:hover {
    background: rgb(191, 90, 242);
  }
  cursor: pointer;
  transition: background 0.4s ease;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
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
