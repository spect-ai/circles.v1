import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getPropertyIcon } from "@/app/modules/CollectionProject/EditProperty/Utils";
import { Box, IconPlusSmall, IconTrash, Stack, Text, useTheme } from "degen";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { PropertyType } from "@/app/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";
import AddField from "../../AddField";
import { AnimatePresence, motion } from "framer-motion";
import { updateField, updateFormCollection } from "@/app/services/Collection";

type Props = {};

type PageComponentProps = {
  id: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
  fields: string[];
  setAddFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
  setActivePage: (value: string) => void;
};

export default function Pages() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  return (
    <Box>
      <Stack>
        <Stack direction="horizontal" space="4" align="center">
          <Text size="headingThree" weight="semiBold" ellipsis>
            Pages
          </Text>
          <PrimaryButton
            variant="transparent"
            onClick={async () => {
              const pageOrder = collection.formMetadata.pageOrder;
              const lastIndex = collection.formMetadata.pages["collect"]
                ? pageOrder.length - 2
                : pageOrder.length - 1;
              console.log(lastIndex);
              const newPageId = `page-${lastIndex + 1}`;
              const res = await updateFormCollection(collection.id, {
                ...collection,
                formMetadata: {
                  ...collection.formMetadata,
                  pageOrder: [
                    ...pageOrder.slice(0, lastIndex),
                    newPageId,
                    ...pageOrder.slice(lastIndex),
                  ],
                  pages: {
                    ...collection.formMetadata.pages,
                    [newPageId]: {
                      id: newPageId,
                      name: "New Page",
                      properties: [],
                      movable: true,
                    },
                  },
                },
              });
              if (res.id) {
                updateCollection(res);
              }
            }}
          >
            <Text color="accent">Add</Text>
          </PrimaryButton>
        </Stack>
        <PagesContainer>
          <PageLine />
        </PagesContainer>
      </Stack>
    </Box>
  );
}

const PageLine = () => {
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

const PageComponent = ({
  id,
  name,
  selected,
  onClick,
  fields,
  setAddFieldOpen,
  setActivePage,
  setPropertyName,
}: PageComponentProps) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const { mode } = useTheme();
  const [pageName, setPageName] = useState(name);

  const [hover, setHover] = useState(false);

  const pages = collection.formMetadata.pages;
  const pageOrder = collection.formMetadata.pageOrder;

  if (pages[id].movable) {
    return (
      <Draggable key={id} draggableId={id} index={pageOrder.indexOf(id)}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Stack direction="horizontal" align="center">
              <PageButton
                selected={selected}
                onClick={onClick}
                paddingX="4"
                paddingY="1"
                borderWidth="0.375"
                borderRadius="medium"
              >
                <NameInput
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  mode={mode}
                />
              </PageButton>
              <Stack direction="horizontal">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hover ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      setActivePage(id);
                      setAddFieldOpen(true);
                    }}
                  >
                    <Text color="accent">
                      <IconPlusSmall size="4" />
                    </Text>
                  </Box>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hover ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      const newPages = { ...pages };
                      const page = newPages[id];
                      if (page.properties.length > 0) {
                        toast.error("Cannot delete a page with fields");
                        return;
                      }
                      delete newPages[id];
                      const pageIndex = pageOrder.indexOf(id);
                      const newPageOrder = [...pageOrder];
                      newPageOrder.splice(pageIndex, 1);

                      updateCollection({
                        ...collection,
                        formMetadata: {
                          ...collection.formMetadata,
                          pages: newPages,
                          pageOrder: newPageOrder,
                        },
                      });
                    }}
                  >
                    <Text color="red">
                      <IconTrash size="4" />
                    </Text>
                  </Box>
                </motion.div>
              </Stack>
            </Stack>

            <Droppable droppableId={id} type="field">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((field, index) => (
                    <FieldComponent
                      key={field}
                      field={field}
                      type={collection.properties[field].type}
                      index={index}
                      setIsAddFieldOpen={setAddFieldOpen}
                      setPropertyName={setPropertyName}
                    />
                  ))}
                  {provided.placeholder}
                  {!fields.length && <Box height="4" />}
                </Box>
              )}
            </Droppable>
          </Box>
        )}
      </Draggable>
    );
  } else {
    return (
      <PageButton
        selected={selected}
        onClick={onClick}
        paddingX="4"
        paddingY="1"
        borderWidth="0.375"
        borderRadius="medium"
      >
        <Text variant="label">{name}</Text>
      </PageButton>
    );
  }
};

type FieldComponentProps = {
  field: string;
  type: PropertyType;
  index: number;
  setIsAddFieldOpen: (open: boolean) => void;
  setPropertyName: (name: string) => void;
};

const FieldComponent = ({
  field,
  type,
  index,
  setIsAddFieldOpen,
  setPropertyName,
}: FieldComponentProps) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [hover, setHover] = useState(false);
  const property = collection.properties[field];
  return (
    <Draggable draggableId={field} key={field} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          opacity={property.isPartOfFormView ? "100" : "50"}
        >
          <Stack key={field} space="0" direction="horizontal" align="center">
            <ConnectorLine
              width="4"
              height="4"
              borderLeftWidth="0.375"
              borderBottomWidth="0.375"
              borderBottomLeftRadius="medium"
            />

            <PropertyButton
              paddingX="4"
              paddingY="1"
              borderWidth="0.375"
              borderRadius="medium"
              marginTop="2"
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="2"
              onClick={() => {
                setPropertyName(property.name);
                setIsAddFieldOpen(true);
              }}
            >
              <Text color="accent">{getPropertyIcon(type, 14)}</Text>
              <Text variant="label">{field}</Text>
            </PropertyButton>
            <Stack direction="horizontal" align="center" space="4">
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box cursor="pointer" marginLeft="2">
                  <Text color="red">
                    <IconTrash size="4" />
                  </Text>
                </Box>
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginLeft: "10px" }}
              >
                {property.isPartOfFormView ? (
                  <Box
                    cursor="pointer"
                    onClick={async () => {
                      const res = await updateField(collection.id, field, {
                        isPartOfFormView: false,
                      });
                      updateCollection(res);
                    }}
                  >
                    <Text variant="label">
                      <EyeInvisibleFilled />
                    </Text>
                  </Box>
                ) : (
                  <Box
                    cursor="pointer"
                    onClick={async () => {
                      const res = await updateField(collection.id, field, {
                        isPartOfFormView: true,
                      });
                      updateCollection(res);
                    }}
                  >
                    <Text variant="label">
                      <EyeFilled />
                    </Text>
                  </Box>
                )}
              </motion.div>
            </Stack>
          </Stack>
        </Box>
      )}
    </Draggable>
  );
};

const PageButton = styled(Box)<{ selected?: boolean }>`
  background: ${(props) =>
    props.selected ? "rgb(255,255,255,0.1)" : "transparent"};
  &:hover {
    background: rgb(255, 255, 255, 0.1);
  }
  width: fit-content;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const PropertyButton = styled(Box)<{}>`
  &:hover {
    background: rgb(255, 255, 255, 0.1);
  }
  width: fit-content;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const ConnectorLine = styled(Box)<{}>`
  margin-top: -10px;
  margin-left: 8px;
`;

const NameInput = styled.input<{ mode: string }>`
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 0.75rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark"
      ? "rgb(255, 255, 255, 0.35)"
      : "rgb(20, 20, 20, 0.35)"};
  font-weight: 600;
  text-transform: uppercase;
  width: fit-content;
  letter-spacing: 0.02rem;
  margin-top: 0.03rem;
`;

const PagesContainer = styled(Box)`
  height: calc(100vh - 15rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;
