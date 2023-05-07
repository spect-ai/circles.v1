import { Box } from "degen";
import { useCallback, useState } from "react";
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
import FormEditor from "./FormEditor";

export function Form() {
  const {
    localCollection: collection,
    updateCollection,
    loading,
    scrollContainerRef,
    currentPage,
  } = useLocalCollection();

  const [editMode, setEditMode] = useState(true);

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
    console.log({ sourcePage });
    const newPage = {
      ...sourcePage,
      properties: Array.from(sourcePage.properties),
    };
    newPage.properties.splice(source.index, 1);
    newPage.properties.splice(destination.index, 0, draggableId);
    console.log({ newPage });
    updateCollection({
      ...collection,
      formMetadata: {
        ...collection.formMetadata,
        pages: {
          ...pages,
          [currentPage]: newPage,
        },
      },
    });
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollContainer ref={scrollContainerRef}>
      <FormContainer>
        {editMode ? (
          <FormEditor setEditMode={setEditMode} />
        ) : (
          <FormBuilder setEditMode={setEditMode} />
        )}
      </FormContainer>
      {/* <InactiveFieldsColumnComponent /> */}
    </ScrollContainer>
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
  height: calc(100vh - 9rem);
`;

const FormContainer = styled(Box)`
  @media (max-width: 992px) {
    width: 100%;
  }
  width: 100%;
`;
