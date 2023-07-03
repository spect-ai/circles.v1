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
import EditorHeader from "./FormEditor/EditorHeader";
import FormDesigner from "./FormDesigner";

export function Form() {
  const {
    localCollection: collection,
    updateCollection,
    loading,
    scrollContainerRef,
    currentPage,
  } = useLocalCollection();

  const [viewPage, setViewPage] = useState("editor");

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
    <Box>
      <EditorHeader setViewPage={setViewPage} viewPage={viewPage} />
      {viewPage === "editor" && <FormEditor />}
      {viewPage === "preview" && <FormBuilder />}
      {viewPage === "design" && <FormDesigner />}
    </Box>
  );
}
