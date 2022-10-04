import { reorder } from "@/app/common/utils/utils";
import { Box, Stack } from "degen";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
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
  const { localCollection: collection, loading } = useLocalCollection();

  const [propertyOrder, setPropertyOrder] = useState(collection.propertyOrder);

  useEffect(() => {
    setPropertyOrder(collection.propertyOrder);
  }, [collection]);

  const handleDragCollectionProperty = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination?.droppableId === source.droppableId &&
      destination?.index === source.index
    ) {
      return;
    }

    if (destination?.droppableId === "activeFields")
      setPropertyOrder(reorder(propertyOrder, source.index, destination.index));
  };

  const DroppableContent = (provided: DroppableProvided) => (
    <Container {...provided.droppableProps} ref={provided.innerRef}>
      <Stack direction="horizontal">
        <ColumnComponent fields={propertyOrder} />
        <InactiveFieldsColumnComponent fields={["budget"]} />
      </Stack>
    </Container>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    propertyOrder,
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
