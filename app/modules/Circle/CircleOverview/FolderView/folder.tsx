import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconEth,
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

interface Props {
  content: string[];
  avatar: string;
  name: string;
  id: string;
  index: number;
  projects: { [key: string]: ProjectType };
}

const ScrollContainer = styled(Box)``;

const Folder = ({ content, avatar, id, name, index, projects }: Props) => {
  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Text>{name}</Text>
      <Box>
        {content?.map((card, i) => {
          if (projects?.[card] && card) {
            return (
              <Card card={card} index={i} key={card} projects={projects} />
            );
          }
        })}
        {provided.placeholder}
      </Box>
    </ScrollContainer>
  );
  const CardDraggableCallback = useCallback(CardDraggable, [content]);
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
      <Droppable droppableId={id} type="task">
        {CardDraggableCallback}
      </Droppable>
    </Box>
  );
  const DraggableContentCallback = useCallback(DraggableContent, [
    CardDraggableCallback,
    id,
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
