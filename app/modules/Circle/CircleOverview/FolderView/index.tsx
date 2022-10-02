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
import { Box, Button, IconPlusSmall, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";
import { createFolder } from "@/app/services/Folders";
import Folder from "./folder";
import useDragFolder from "./useDragHook";
import { matchSorter } from "match-sorter";

interface Props {
  filteredProjects: {
    [key: string]: ProjectType;
  };
  filteredRetro: RetroType[];
  filteredWorkstreams: {
    [key: string]: CircleType;
  };
  filteredCollections: CollectionType[];
  setIsRetroOpen: (isRetroOpen: boolean) => void;
}

export const FolderView = ({
  filteredProjects,
  filteredCollections,
  filteredWorkstreams,
  filteredRetro,
  setIsRetroOpen,
}: Props) => {
  const router = useRouter();
  const { handleDrag } = useDragFolder();
  const { localCircle: circle, setCircleData, setLocalCircle } = useCircle();
  const [allContentIds, setAllContentIds] = useState([] as string[]);
  const [unclassified, setUnclassified] = useState([] as string[]);
  const [projects, setProjects] = useState({});

  const { canDo } = useRoleGate();
  const createNewFolder = useCallback(async () => {
    const payload = {
      name: `Folder-${circle.folderOrder?.length + 1}`,
      avatar: "newFolder",
      contentIds: [] as string[],
    };
    const res = await createFolder(payload, circle?.id);
    if (res) {
      setCircleData(res);
      setLocalCircle(res);
    }
  }, [circle.folderOrder]);

  function getFormattedData() {
    let ids = [] as string[];
    circle?.folderDetails &&
      Object.values(circle?.folderDetails)?.map((folder) => {
        ids = ids.concat(folder.contentIds);
      });
    setAllContentIds(ids);

    // const workstreams = filteredWorkstreams?.reduce(
    //   (rest, workstream) => ({ ...rest, [workstream.id]: workstream }),
    //   {}
    // );
    // const retros = filteredRetro?.reduce(
    //   (rest, retro) => ({ ...rest, [retro.id]: retro }),
    //   {}
    // );

    filteredProjects &&
      Object.values(filteredProjects)?.map((project) => {
        if (!allContentIds.includes(project.id)) {
          setUnclassified([...unclassified, project.id]);
        }
      });

    // filteredWorkstreams?.map((child) => {
    //   if (!allContentIds.includes(child.id)) {
    //     setUnclassified([...unclassified, child.id]);
    //   }
    // });

    // filteredRetro?.map((re) => {
    //   if (!allContentIds.includes(re.id)) {
    //     setUnclassified([...unclassified, re.id]);
    //   }
    // });
  }

  useEffect(() => {
    setUnclassified([]);
    setProjects({});
    getFormattedData();
  }, []);

  console.log(unclassified);

  const DroppableContent = (provided: DroppableProvided) => (
    <Box {...provided.droppableProps} ref={provided.innerRef}>
      <Stack>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Folders
        </Text>
        {canDo("createNewRetro") && (
          <Box onClick={createNewFolder} cursor="pointer">
            <IconPlusSmall />
          </Box>
        )}
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
          />
        );
      })}
      <Folder
        content={unclassified}
        avatar={"null"}
        id="unclassified"
        name="Unclassified"
        index={circle?.folderOrder?.length}
        projects={filteredProjects}
      />
      {provided.placeholder}
    </Box>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    canDo,
    circle?.folderDetails,
    circle?.folderOrder,
    createNewFolder,
    filteredProjects,
    setCircleData,
  ]);

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="all-columns" type="folder">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
};
