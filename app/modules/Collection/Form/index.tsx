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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 7rem);
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
  overflow-x: auto;
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
      <Box display="flex" flexDirection="column">
        {collection?.propertyOrder?.map((propertyId, index): any => {
          return (
            <Box
              display="flex"
              flexDirection="column"
              margin="8"
              alignItems="flex-start"
              key={propertyId}
            >
              <Box marginBottom="4">
                <Text>{propertyId}</Text>
              </Box>
            </Box>
          );
        })}

        {collection?.id && (
          <Box style={{ width: "20rem" }} marginTop="2">
            <PrimaryButton
              variant="tertiary"
              icon={<IconPlusSmall />}
              onClick={async () => {
                // const updatedProject = await addColumn(collection.id);
                // if (!updatedProject) {
                //   toast.error("Error adding column", {
                //     theme: "dark",
                //   });
                // }
                // setLocalCollection(updatedProject);
              }}
            >
              Add new field
            </PrimaryButton>
          </Box>
        )}
      </Box>
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
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {DroppableContentCallback}
          </Droppable>
        </DragDropContext>
      </Box>
      <Box
        width="128"
        borderWidth="0.5"
        borderRadius="medium"
        borderColor="accentSecondary"
      >
        <DragDropContext onDragEnd={handleDragCollectionProperty}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {DroppableContentCallback}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
}
