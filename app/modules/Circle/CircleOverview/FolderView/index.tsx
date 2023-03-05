import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, ProjectType, RetroType } from "@/app/types";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { Box, Stack } from "degen";
import React, { useCallback, useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";
import Folder from "./folder";
import useDragFolder from "./useDragHook";
import styled from "styled-components";
import CreateItems from "./CreateItems";

interface Props {
  filteredProjects?: {
    [key: string]: ProjectType;
  };
  filteredRetro?: {
    [key: string]: RetroType;
  };
  filteredWorkstreams?: {
    [key: string]: CircleType;
  };
  filteredCollections?: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
  setIsRetroOpen: (isRetroOpen: boolean) => void;
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    height: calc(100vh - 12rem);
  }
  height: calc(100vh - 10rem);
`;

export const FolderView = ({
  filteredProjects,
  filteredWorkstreams,
  filteredRetro,
  filteredCollections,
}: Props) => {
  const { handleDrag } = useDragFolder();
  const { circle } = useCircle();
  const [allContentIds, setAllContentIds] = useState([] as string[]);
  const { canDo } = useRoleGate();

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

    filteredCollections &&
      Object.values(filteredCollections)?.map((collection) => {
        if (!allContentIds.includes(collection.id)) {
          unclassifiedIds = unclassifiedIds.concat(collection.id);
        }
      });
  }, [
    allContentIds,
    circle?.folderDetails,
    filteredCollections,
    filteredProjects,
    filteredRetro,
    filteredWorkstreams,
  ]);

  useEffect(() => {
    setAllContentIds([]);
    getFormattedData();
  }, [circle]);

  const DroppableContent = (provided: DroppableProvided) => (
    <ScrollContainer
      {...provided.droppableProps}
      ref={provided.innerRef}
      paddingTop="4"
    >
      <Stack direction="horizontal" align="baseline">
        <CreateItems />
      </Stack>
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
            collections={filteredCollections}
            retros={filteredRetro}
          />
        );
      })}
      {provided.placeholder}
    </ScrollContainer>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    canDo,
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
