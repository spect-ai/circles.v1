import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { PageComponent } from "./PageComponent";

export const PageLine = () => {
  const {
    currentPage,
    setCurrentPage,
    localCollection: collection,
    updateCollection,
  } = useLocalCollection();
  let middleStartIndex = null;
  let middleEndIndex = null;

  const pages = collection.formMetadata.pages;
  const pageOrder = collection.formMetadata.pageOrder || [];

  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [propertyName, setPropertyName] = useState<string>();

  let i = 0;
  for (const pageId of pageOrder) {
    if (!pages[pageId]) return null;
    if (pages[pageId].movable && middleStartIndex === null) {
      middleStartIndex = i;
    }
    if (!pages[pageId].movable && middleStartIndex !== null) {
      middleEndIndex = i;
      break;
    }
    i++;
  }

  if (middleStartIndex === null || middleEndIndex === null) {
    // No movable element found, render all elements as normal
    return (
      <div>
        {pageOrder.map((pageId) => (
          <PageComponent
            id={pageId}
            name={pages[pageId].name}
            key={pageId}
            selected={currentPage === pageId}
            onClick={() => setCurrentPage(pageId)}
            fields={pages[pageId].properties}
            setAddFieldOpen={setAddFieldOpen}
            setActivePage={setActivePage}
            setPropertyName={setPropertyName}
          />
        ))}
      </div>
    );
  } else {
    const firstHalf = pageOrder.slice(0, middleStartIndex);
    const middleSection = pageOrder.slice(middleStartIndex, middleEndIndex);
    const secondHalf = pageOrder.slice(middleEndIndex);
    const handleDragEnd = (result: DropResult) => {
      const { destination, source, draggableId, type } = result;
      console.log({ destination, source, draggableId, type });

      if (!destination) return;

      if (type === "page") {
        const newPageOrder = Array.from(pageOrder);
        newPageOrder.splice(source.index, 1);
        newPageOrder.splice(destination.index, 0, draggableId);
        updateCollection({
          ...collection,
          formMetadata: {
            ...collection.formMetadata,
            pageOrder: newPageOrder,
          },
        });
        updateFormCollection(collection.id, {
          ...collection,
          formMetadata: {
            ...collection.formMetadata,
            pageOrder: newPageOrder,
          },
        });
      }

      if (type === "field") {
        const sourcePage = pages[source.droppableId];
        const destinationPage = pages[destination.droppableId];

        if (sourcePage === destinationPage) {
          if (source.index === destination.index) return;

          const newPage = {
            ...sourcePage,
            properties: Array.from(sourcePage.properties),
          };
          newPage.properties.splice(source.index, 1);
          newPage.properties.splice(destination.index, 0, draggableId);
          updateCollection({
            ...collection,
            formMetadata: {
              ...collection.formMetadata,
              pages: {
                ...pages,
                [source.droppableId]: newPage,
              },
            },
          });
          updateFormCollection(collection.id, {
            ...collection,
            formMetadata: {
              ...collection.formMetadata,
              pages: {
                ...pages,
                [source.droppableId]: newPage,
              },
            },
          });
          return;
        }

        const newSourcePage = {
          ...sourcePage,
          properties: Array.from(sourcePage.properties),
        };
        const newDestinationPage = {
          ...destinationPage,
          properties: Array.from(destinationPage.properties),
        };

        newSourcePage.properties.splice(source.index, 1);
        newDestinationPage.properties.splice(destination.index, 0, draggableId);

        updateCollection({
          ...collection,
          formMetadata: {
            ...collection.formMetadata,
            pages: {
              ...pages,
              [source.droppableId]: newSourcePage,
              [destination.droppableId]: newDestinationPage,
            },
          },
        });
        updateFormCollection(collection.id, {
          ...collection,
          formMetadata: {
            ...collection.formMetadata,
            pages: {
              ...pages,
              [source.droppableId]: newSourcePage,
              [destination.droppableId]: newDestinationPage,
            },
          },
        });
      }
    };

    return (
      <Box>
        <AnimatePresence>
          {addFieldOpen && (
            <AddField
              handleClose={() => setAddFieldOpen(false)}
              pageId={activePage}
              propertyName={propertyName}
            />
          )}
        </AnimatePresence>
        <Stack>
          {firstHalf.map((pageId) => (
            <PageComponent
              id={pageId}
              name={pages[pageId].name}
              key={pageId}
              selected={currentPage === pageId}
              onClick={() => setCurrentPage(pageId)}
              fields={pages[pageId].properties}
              setAddFieldOpen={setAddFieldOpen}
              setActivePage={setActivePage}
              setPropertyName={setPropertyName}
            />
          ))}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="page-zone" direction="vertical" type="page">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  <Stack>
                    {middleSection.map((pageId) => (
                      <PageComponent
                        id={pageId}
                        name={pages[pageId].name}
                        key={pageId}
                        selected={currentPage === pageId}
                        onClick={() => setCurrentPage(pageId)}
                        fields={pages[pageId].properties}
                        setAddFieldOpen={setAddFieldOpen}
                        setActivePage={setActivePage}
                        setPropertyName={setPropertyName}
                      />
                    ))}
                  </Stack>
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          {secondHalf.map((pageId) => (
            <PageComponent
              id={pageId}
              name={pages[pageId].name}
              key={pageId}
              selected={currentPage === pageId}
              onClick={() => setCurrentPage(pageId)}
              fields={pages[pageId].properties}
              setAddFieldOpen={setAddFieldOpen}
              setActivePage={setActivePage}
              setPropertyName={setPropertyName}
            />
          ))}
        </Stack>
      </Box>
    );
  }
};
