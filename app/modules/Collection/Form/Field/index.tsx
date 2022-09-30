import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { CardType, MemberDetails } from "@/app/types";
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
import { useRouter } from "next/router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  id: string;
  index: number;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-color: ${(props) => props.isDragging && "rgb(191, 90, 242, 1)"};
  border-width: ${(props) => props.isDragging && "2px"};
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
    border-width: 2px;
  }
`;

function FieldComponent({ id, index }: Props) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

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
      margin="1"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      mode={mode}
    >
      <Box>
        <Box marginTop="1" marginBottom="4">
          <Stack direction="horizontal" space="2" justify="space-between">
            <Text weight="semiBold">{id}</Text>
          </Stack>
        </Box>
      </Box>
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

export default memo(FieldComponent);
