import { Box, Stack, Text, useTheme } from "degen";
import React, { memo, useCallback } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";

type Props = {
  id: string;
  index: number;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-color: ${(props) => props.isDragging && "rgb(191, 90, 242, 1)"};
  border: ${(props) =>
    props.isDragging
      ? "2px solid rgb(191, 90, 242, 1)"
      : "2px solid transparent"};

  transition: border-color 0.5s ease;
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
    border-width: 2px;
  }
`;

function InactiveFieldComponent({ id, index }: Props) {
  const { mode } = useTheme();

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      borderRadius="2xLarge"
      isDragging={snapshot.isDragging}
      mode={mode}
      padding="4"
    >
      <Stack direction="horizontal" space="2" justify="space-between">
        <Text weight="semiBold">{id}</Text>
      </Stack>
    </Container>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [mode]);

  return (
    <Draggable draggableId={id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
}

export default memo(InactiveFieldComponent);
