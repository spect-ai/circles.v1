import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Box, Text, useTheme } from "degen";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import styled from "styled-components";
import { useCircle } from "../../CircleContext";

interface Props {
  card: string;
  index: number;
  projects?: {
    [key: string]: ProjectType;
  };
  workstreams?: {
    [key: string]: CircleType;
  };
  retros?: {
    [key: string]: RetroType;
  };
}

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-width: 2px;
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
`;

const Card = ({ card, index, projects, workstreams, retros }: Props) => {
  const { localCircle: circle } = useCircle();
  const { mode } = useTheme();
  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="4"
      marginBottom="2"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      mode={mode}
    >
      <Text>
        {projects?.[card]?.name ||
          workstreams?.[card].name ||
          retros?.[card].title}
      </Text>
    </Container>
  );
  const DraggableContentCallback = useCallback(DraggableContent, [
    circle?.folderOrder,
    circle?.folderDetails,
  ]);

  return (
    <Draggable draggableId={card} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Card);
