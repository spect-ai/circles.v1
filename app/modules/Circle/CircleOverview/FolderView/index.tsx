import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { Box, Button, IconPlusSmall, Text } from "degen";
import React, { useCallback, useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";
import { createFolder } from "@/app/services/Folders";
import Folder from "./folder";
import useDragFolder from "./useDragHook";
import styled from "styled-components";

interface Props {
  filteredProjects: {
    [key: string]: ProjectType;
  };
  filteredRetro: {
    [key: string]: RetroType;
  };
  filteredWorkstreams: {
    [key: string]: CircleType;
  };
  filteredCollections: CollectionType[];
  setIsRetroOpen: (isRetroOpen: boolean) => void;
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 7.5rem);
`;

export const FolderView = ({
  filteredProjects,
  filteredCollections,
  filteredWorkstreams,
  filteredRetro,
  setIsRetroOpen,
}: Props) => {
  const { handleDrag } = useDragFolder();
  const { localCircle: circle, setCircleData, setLocalCircle } = useCircle();
  const [allContentIds, setAllContentIds] = useState([] as string[]);
  const [unclassified, setUnclassified] = useState([] as string[]);

  const { canDo } = useRoleGate();
  const createNewFolder = useCallback(async () => {
    console.log(circle?.folderOrder?.length);
    console.log(circle?.folderOrder);
    console.log(circle?.folderOrder?.[0]);
    const payload = {
      name:
        circle?.folderOrder?.length === undefined || NaN || 0
          ? "All"
          : `Folder-${circle?.folderOrder?.length + 1}`,
      avatar:
        circle?.folderOrder?.length === undefined || NaN || 0
          ? "All"
          : "New Avatar",
      contentIds:
        circle?.folderOrder?.length === undefined || NaN || 0
          ? unclassified
          : ([] as string[]),
    };
    const res = await createFolder(payload, circle?.id);
    if (res) {
      console.log(`New Folder with name - ${payload.name} created `);
      setCircleData(res);
      setLocalCircle(res);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle?.folderOrder?.length, circle?.id, unclassified]);

  const getFormattedData = useCallback(() => {
    let ids = [] as string[];
    circle?.folderDetails &&
      Object.values(circle?.folderDetails)?.map((folder) => {
        ids = ids.concat(folder?.contentIds);
      });
    setAllContentIds(ids);

    let unclassifiedIds = [] as string[];
    filteredProjects &&
      Object.values(filteredProjects)?.map((project) => {
        if (!ids.includes(project.id)) {
          unclassifiedIds = unclassifiedIds.concat(project.id);
        }
      });

    filteredWorkstreams &&
      Object.values(filteredWorkstreams)?.map((child) => {
        if (!allContentIds.includes(child.id)) {
          unclassifiedIds = unclassifiedIds.concat(child.id);
        }
      });

    filteredRetro &&
      Object.values(filteredRetro)?.map((re) => {
        if (!allContentIds.includes(re.id)) {
          unclassifiedIds = unclassifiedIds.concat(re.id);
        }
      });

    setUnclassified(unclassifiedIds);
  }, [
    allContentIds,
    circle?.folderDetails,
    filteredProjects,
    filteredRetro,
    filteredWorkstreams,
  ]);

  useEffect(() => {
    setAllContentIds([]);
    setUnclassified([]);
    getFormattedData();
  }, [circle]);

  const DroppableContent = (provided: DroppableProvided) => (
    <ScrollContainer
      {...provided.droppableProps}
      ref={provided.innerRef}
      paddingTop="4"
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems="center"
        gap="3"
        paddingBottom={"4"}
      >
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Sections
        </Text>
        {canDo("manageCircleSettings") && (
          <Button
            data-tour="circle-create-folder-button"
            size="small"
            variant="transparent"
            shape="circle"
            onClick={createNewFolder}
          >
            <IconPlusSmall />
          </Button>
        )}
      </Box>
      {circle?.folderOrder?.length == 0 && (
        <Box>
          <Text variant="label">
            Create Folders to classify and view Projects, Workstreams & Retro
          </Text>
        </Box>
      )}
      {circle?.folderOrder?.map((folder, i) => {
        const folderDetail = circle?.folderDetails?.[folder];
        return (
          <Folder
            key={folder}
            content={folderDetail?.contentIds}
            avatar={folderDetail?.avatar}
            id={folder}
            name={folderDetail?.name}
            index={i}
            projects={filteredProjects}
            workstreams={filteredWorkstreams}
            retros={filteredRetro}
          />
        );
      })}
      {provided.placeholder}
    </ScrollContainer>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DroppableContentCallback = useCallback(DroppableContent, [
    canDo,
    circle?.folderDetails,
    circle?.folderOrder,
    circle,
    filteredProjects,
    filteredRetro,
    filteredWorkstreams,
  ]);

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="all-folders" direction="vertical" type="folder">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
};
