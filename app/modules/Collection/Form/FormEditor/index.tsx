import { Avatar, Box, Stack, Text } from "degen";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import Editor from "@/app/common/components/Editor";
import EditorHeader from "./EditorHeader";
import { useEffect, useState } from "react";
import Page from "./Page";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { logError } from "@/app/common/utils/utils";
import { deleteField, updateFormCollection } from "@/app/services/Collection";
import styled from "@emotion/styled";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { CollectionType } from "@/app/types";
import { AnimatePresence } from "framer-motion";

const FormEditor = () => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [name, setName] = useState(collection.name);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmOnDelete, setShowConfirmOnDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const onDragEnd = async (result: DropResult) => {
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

    if (destination.droppableId === source.droppableId) {
      // change property order of page
      const pageId = source.droppableId;
      const page = collection.formMetadata.pages[pageId];
      const newPropertyOrder = Array.from(page.properties);
      newPropertyOrder.splice(source.index, 1);
      newPropertyOrder.splice(destination.index, 0, draggableId);
      const update = {
        ...collection,
        formMetadata: {
          ...collection.formMetadata,
          pages: {
            ...collection.formMetadata.pages,
            [pageId]: {
              ...page,
              properties: newPropertyOrder,
            },
          },
        },
      };
      updateCollection(update);
      const res = await updateFormCollection(collection.id, update);
      if (!res.id) {
        logError("Failed to update form collection");
      }
    }

    if (destination.droppableId !== source.droppableId) {
      const sourcePage = collection.formMetadata.pages[source.droppableId];
      const destinationPage =
        collection.formMetadata.pages[destination.droppableId];
      const newSourcePropertyOrder = Array.from(sourcePage.properties);
      newSourcePropertyOrder.splice(source.index, 1);
      const newDestinationPropertyOrder = Array.from(
        destinationPage.properties
      );
      newDestinationPropertyOrder.splice(destination.index, 0, draggableId);
      const update = {
        ...collection,
        formMetadata: {
          ...collection.formMetadata,
          pages: {
            ...collection.formMetadata.pages,
            [source.droppableId]: {
              ...sourcePage,
              properties: newSourcePropertyOrder,
            },
            [destination.droppableId]: {
              ...destinationPage,
              properties: newDestinationPropertyOrder,
            },
          },
        },
      };

      updateCollection(update);
      const res = await updateFormCollection(collection.id, update);
      if (!res.id) {
        logError("Failed to update form collection");
      }
    }
  };

  return (
    <ScrollContainer>
      <Stack align="center">
        <AnimatePresence>
          {showConfirmOnDelete && (
            <ConfirmModal
              title="This will remove existing data associated with this field, if you're looking to avoid this please set the field as inactive. Are you sure you want to delete this field?"
              handleClose={() => setShowConfirmOnDelete(false)}
              onConfirm={async () => {
                setDeleteLoading(true);
                const res: CollectionType = await deleteField(
                  collection.id,
                  (propertyId as string).trim()
                );
                if (res.id) {
                  updateCollection(res);
                } else {
                  logError("Error deleting field");
                }
                setShowConfirmOnDelete(false);
                setDeleteLoading(false);
              }}
              onCancel={() => setShowConfirmOnDelete(false)}
            />
          )}
        </AnimatePresence>
        <Container>
          <Box width="full">
            <Stack>
              {collection.formMetadata.logo && (
                <Avatar src={collection.formMetadata.logo} label="" size="20" />
              )}
              <NameInput
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onBlur={async () => {
                  if (name === collection.name) return;
                  const res = await updateFormCollection(collection.id, {
                    name,
                  });
                  if (res.id) {
                    updateCollection(res);
                  } else {
                    logError("Failed to update collection name");
                  }
                }}
              />
              <Stack>
                <Editor
                  placeholder={`Form description`}
                  isDirty={isDirty}
                  onChange={() => {
                    setIsDirty(true);
                  }}
                  onSave={async (value) => {
                    const res = await updateFormCollection(collection.id, {
                      description: value,
                    });
                    setIsDirty(false);
                    if (res.id) {
                      updateCollection(res);
                    } else {
                      logError("Failed to update collection description");
                    }
                  }}
                  version={2}
                />
                <DragDropContext onDragEnd={onDragEnd}>
                  {collection.formMetadata.pageOrder.map((pageId) => {
                    const page = collection.formMetadata.pages[pageId];
                    return (
                      <Page
                        key={pageId}
                        pageId={pageId}
                        fields={page.properties}
                        setShowConfirmOnDelete={setShowConfirmOnDelete}
                        setPropertyId={setPropertyId}
                      />
                    );
                  })}
                </DragDropContext>
              </Stack>
            </Stack>
          </Box>
          <Box
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          ></Box>
        </Container>
      </Stack>
    </ScrollContainer>
  );
};

const Container = styled(Box)`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 1.5rem;
  }

  width: 42rem;
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 16rem);
`;

export default FormEditor;
