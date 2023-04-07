import { updateFormCollection } from "@/app/services/Collection";
import { UserType } from "@/app/types";
import { Box, IconPlusSmall, IconTrash, Stack, Text, useTheme } from "degen";
import { motion } from "framer-motion";
import mixpanel from "mixpanel-browser";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "./FieldComponent";

type Props = {
  id: string;
  name: string;
  fields: string[];
  setAddFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
  setActivePage: (value: string) => void;
  selected?: boolean;
  onClick?: () => void;
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

const PageComponent = ({
  id,
  name,
  selected,
  onClick,
  fields,
  setAddFieldOpen,
  setActivePage,
  setPropertyName,
}: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { mode } = useTheme();
  const [pageName, setPageName] = useState(name);

  const [hover, setHover] = useState(false);

  const { pages } = collection.formMetadata;
  const { pageOrder } = collection.formMetadata;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

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
                  onBlur={() => {
                    const newPages = { ...pages };
                    newPages[id].name = pageName;
                    const update = {
                      formMetadata: {
                        ...collection.formMetadata,
                        pages: newPages,
                      },
                    };
                    updateCollection({
                      ...collection,
                      ...update,
                    });
                    updateFormCollection(collection.id, update);
                  }}
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

                      const update = {
                        formMetadata: {
                          ...collection.formMetadata,
                          pages: newPages,
                          pageOrder: newPageOrder,
                        },
                      };
                      updateCollection({
                        ...collection,
                        ...update,
                      });
                      updateFormCollection(collection.id, update);
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
              {(provided2) => (
                <Box
                  {...provided2.droppableProps}
                  ref={provided2.innerRef}
                  onClick={onClick}
                >
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
                  {provided2.placeholder}
                  {!fields.length && <Box height="4" />}
                  <Box
                    marginTop="2"
                    marginLeft="6"
                    cursor="pointer"
                    onClick={() => {
                      process.env.NODE_ENV === "production" &&
                        mixpanel.track("Add field on page", {
                          collection: collection.slug,
                          circle: collection.parents[0].slug,
                          page: id,
                          user: currentUser?.username,
                        });
                      setActivePage(id);
                      onClick && onClick();
                      setPropertyName("");
                      setAddFieldOpen(true);
                    }}
                  >
                    <Stack direction="horizontal" space="2">
                      <Text color="accent">
                        <IconPlusSmall size="4" />
                      </Text>
                      <Text color="accent">Add field</Text>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Droppable>
          </Box>
        )}
      </Draggable>
    );
  }
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
};

PageComponent.defaultProps = {
  onClick: () => {},
  selected: false,
};

export default PageComponent;
