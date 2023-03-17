import { Box, IconPencil, Text, useTheme } from "degen";
import React, { memo, useCallback } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  id: string;
  index: number;
  setIsEditFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-color: ${(props) => props.isDragging && "rgb(191, 90, 242, 1)"};
  border: ${(props) =>
    props.isDragging
      ? "2px solid rgb(191, 90, 242, 1)"
      : "2px solid rgb(255, 255, 255, 0.1)"};

  &:hover {
    border: 1px solid rgb(191, 90, 242, 1);
  }

  transition: border-color 0.5s ease;
  border-width: 1px;
  }
`;

function InactiveFieldComponent({
  id,
  index,
  setIsEditFieldOpen,
  setPropertyName,
}: Props) {
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { localCollection: collection } = useLocalCollection();

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
      padding="2"
      display="flex"
      justifyContent="center"
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap="4">
        <Text weight="semiBold">{id}</Text>
        <Box
          cursor="pointer"
          borderRadius="full"
          paddingY="1"
          paddingX="2"
          onClick={() => {
            setPropertyName(id);
            setIsEditFieldOpen(true);
            process.env.NODE_ENV === "production" &&
              mixpanel.track("Edit Field Button", {
                user: currentUser?.username,
                field: collection.properties[id]?.name,
              });
          }}
        >
          <IconPencil color="accent" size="4" />
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

export default memo(InactiveFieldComponent);
