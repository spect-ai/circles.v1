import { Avatar, Box, Stack, Text } from "degen";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import Editor from "@/app/common/components/Editor";
import { useEffect, useState } from "react";
import Page from "./Page";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { logError } from "@/app/common/utils/utils";
import { deleteField, updateFormCollection } from "@/app/services/Collection";
import styled from "@emotion/styled";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { CollectionType } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const FormEditor = () => {
  const {
    localCollection: collection,
    updateCollection,
    scrollContainerRef,
  } = useLocalCollection();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState("");

  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmOnDelete, setShowConfirmOnDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  useEffect(() => {
    console.log({
      description: collection.description,
      slug: collection.slug,
      name: collection.name,
    });
    setName(collection.name);
    setDescription(collection.description);
  }, [collection.slug]);

  return (
    <ScrollContainer ref={scrollContainerRef}>
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
        <Container borderWidth="0.375" borderRadius="2xLarge" padding="8">
          <Box width="full">
            <Stack space="4">
              <Box padding="8">
                {collection.formMetadata.logo && (
                  <Avatar
                    src={collection.formMetadata.logo}
                    label=""
                    size="12"
                  />
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
                {description && (
                  <Editor
                    value={description}
                    placeholder={`Form description`}
                    isDirty={isDirty}
                    onChange={() => {
                      setIsDirty(true);
                    }}
                    onSave={async (value) => {
                      console.log(value);
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
                )}
              </Box>
              <Stack>
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

  width: 46rem;
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 14rem);
`;

export default FormEditor;
