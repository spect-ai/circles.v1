import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconTrash,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import styled from "styled-components";
import Card from "./card";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import { deleteFolder } from "@/app/services/Folders";
import { useCircle } from "../../CircleContext";

interface Props {
  content: string[];
  avatar: string;
  name: string;
  id: string;
  index: number;
  projects: { [key: string]: ProjectType };
  workstreams: { [key: string]: CircleType };
}

const ScrollContainer = styled(Box)``;

const Folder = ({
  content,
  avatar,
  id,
  name,
  index,
  projects,
  workstreams,
}: Props) => {
  console.log(content);
  const { canDo } = useRoleGate();
  const { localCircle: circle, setCircleData, setLocalCircle } = useCircle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ondeleteFolder = async () => {
    const res = await deleteFolder(circle.id, id);
    console.log({ res });

    if (res?.id) {
      setCircleData(res);
      setLocalCircle(res);
    }
  };

  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {content?.map((card, i) => {
          console.log(projects)
          if (projects?.[card] && card) {
            console.log(projects)
            return (
              <Card card={card} index={i} key={card} projects={projects} />
            );
          }
          if (workstreams?.[card] && card) {
            return (
              <Card
                card={card}
                index={i}
                key={card}
                workstreams={workstreams}
              />
            );
          }
        })}
        {provided.placeholder}
      </Box>
    </ScrollContainer>
  );
  const CardDraggableCallback = useCallback(CardDraggable, [
    content,
    projects,
    workstreams,
  ]);
  const DraggableContent = (provided: DraggableProvided) => (
    <Box
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="2"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Stack direction={"horizontal"} align={"center"}>
        <Text variant="large" weight="medium">
          {name}
        </Text>
        {avatar !== "All" &&
          content.length == 0 &&
          canDo("manageCircleSettings") && (
            <Box onClick={ondeleteFolder}>
              <IconTrash size={"5"} color={"accent"} />
            </Box>
          )}
      </Stack>
      <Droppable droppableId={id} type="task">
        {CardDraggableCallback}
      </Droppable>
    </Box>
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    CardDraggableCallback,
    avatar,
    canDo,
    content.length,
    id,
    name,
    ondeleteFolder,
    circle?.folderOrder,
    circle?.folderDetails,
  ]);

  return (
    <Draggable
      draggableId={id}
      index={index}
      isDragDisabled={id == "unclassified"}
    >
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Folder);
