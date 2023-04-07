import { updateFormCollection } from "@/app/services/Collection";
import { UserType } from "@/app/types";
import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import mixpanel from "mixpanel-browser";
import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import PageComponent from "./PageComponent";

const PageLine = () => {
  const {
    currentPage,
    setCurrentPage,
    localCollection: collection,
    updateCollection,
  } = useLocalCollection();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  let middleStartIndex: number | null = null;
  let middleEndIndex: number | null = null;

  const { pages } = collection.formMetadata;
  const pageOrder = collection.formMetadata.pageOrder || [];

  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [propertyName, setPropertyName] = useState<string>();

  let i = 0;
  pageOrder.forEach((pageId) => {
    if (!pages[pageId]) return null;
    if (pages[pageId].movable && middleStartIndex === null) {
      middleStartIndex = i;
    }
    if (!pages[pageId].movable && middleStartIndex !== null) {
      middleEndIndex = i;
      return null;
    }
    i += 1;
    return null;
  });

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
  }
  const firstHalf = pageOrder.slice(0, middleStartIndex);
  const middleSection = pageOrder.slice(middleStartIndex, middleEndIndex);
  const secondHalf = pageOrder.slice(middleEndIndex);
  const handleDragEnd = (result: DropResult) => {
    process.env.NODE_ENV === "production" &&
      mixpanel.track("Drag/Drop field", {
        form: collection.slug,
        circle: collection.parents[0].slug,
        user: currentUser?.username,
      });
    const { destination, source, draggableId, type } = result;
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
};

export default PageLine;
