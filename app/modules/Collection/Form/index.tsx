import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconPlusSmall, Stack, Text } from "degen";
import { useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import useDragCollectionProperty from "../../Project/Hooks/useDragCollectionProperty";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import ColumnComponent from "./Column";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
  overflow-y: hidden;
`;

export function Form() {
  const { handleDragCollectionProperty } = useDragCollectionProperty();
  const {
    localCollection: collection,
    setLocalCollection,
    loading,
    advFilters,
  } = useLocalCollection();

  const DroppableContent = (provided: DroppableProvided) => (
    <Container {...provided.droppableProps} ref={provided.innerRef}>
      <Stack direction="horizontal">
        <Box display="flex" flexDirection="column">
          <ColumnComponent fields={["1", "2", "3"]} />
          );
        </Box>
        <Box display="flex" flexDirection="column">
          <InactiveFieldsColumnComponent fields={["a", "b", "c"]} />
          );
        </Box>
      </Stack>
    </Container>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    collection?.propertyOrder,
    collection.id,
    setLocalCollection,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box display="flex" flexDirection="row" marginRight="6">
      <Box width="288">
        <DragDropContext onDragEnd={handleDragCollectionProperty}>
          <Droppable
            droppableId="all-fields"
            direction="horizontal"
            type="fields"
          >
            {DroppableContentCallback}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
}
