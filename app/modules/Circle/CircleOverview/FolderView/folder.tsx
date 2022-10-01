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

const ScrollContainer = styled(Box)``;

const Folder = ({ content, avatar, id, name, index }: any) => {
  const CardDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {content?.map(({ card, idx }: any) => {
          if (card) {
            return <Card card={card} index={idx} key={card.id} />;
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
  const DraggableContentCallback = useCallback(DraggableContent, [CardDraggableCallback, id]);

  return (
    <Draggable
      draggableId={id}
      index={index}
      // isDragDisabled={space.roles[user?.id as string] !== 3}
    >
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Folder);
