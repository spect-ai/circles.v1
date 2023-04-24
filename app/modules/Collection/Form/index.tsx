import { logError } from "@/app/common/utils/utils";
import { Box } from "degen";
import { useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormBuilder from "./FormBuilder";
import InactiveFieldsColumnComponent from "./InactiveFieldsColumn";
import { updateFormCollection } from "@/app/services/Collection";

export function Form() {
  const {
    localCollection: collection,
    updateCollection,
    loading,
    currentPage,
    scrollContainerRef,
  } = useLocalCollection();

  const handleDragCollectionProperty = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const pages = collection.formMetadata.pages;
    const sourcePage = pages[currentPage];
    const newPage = {
      ...sourcePage,
      properties: Array.from(sourcePage.properties),
    };
    newPage.properties.splice(source.index, 1);
    newPage.properties.splice(destination.index, 0, draggableId);
    const update = {
      ...collection,
      formMetadata: {
        ...collection.formMetadata,
        pages: {
          ...pages,
          [currentPage]: newPage,
        },
      },
    };
    updateCollection(update);
    const res = await updateFormCollection(collection.id, update);
    if (res.id) {
      updateCollection(res);
    } else {
      logError("Error updating field order");
    }
  };

  const DroppableContent = (provided: DroppableProvided) => {
    return (
      <Box {...provided.droppableProps} ref={provided.innerRef}>
        <ScrollContainer ref={scrollContainerRef}>
          <FormContainer>
            <FormBuilder />
          </FormContainer>
          <InactiveFieldsColumnComponent />
        </ScrollContainer>
      </Box>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DroppableContentCallback = useCallback(DroppableContent, [collection]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DragDropContext onDragEnd={handleDragCollectionProperty}>
      <Droppable droppableId="all-fields" direction="horizontal" type="fields">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 0.5rem;
    margin-top: 0rem;
    height: calc(100vh - 9rem);
  }
  flex-direction: row;
  padding: 1.5rem;
  margin-top: 1rem;
  height: calc(100vh - 7rem);
`;

const FormContainer = styled(Box)`
  @media (max-width: 992px) {
    width: 100%;
  }
  width: 80%;
`;
