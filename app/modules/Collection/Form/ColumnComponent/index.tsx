import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack } from "degen";
import { memo, useCallback, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FieldComponent from "../Field";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: none;
  width: 36rem;
  border-width: 2px;
  padding: 2rem;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  border-radius: 0.5rem;
  overflow-y: auto;
`;

const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

const DescriptionInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: rgb(255, 255, 255, 0.5);
  color: rgb(255, 255, 255, 0.5);
  font-weight: 400;
`;

type Props = {
  fields: string[];
};

function ColumnComponent({ fields }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [title, setTitle] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);

  const FieldDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {fields?.map((field, idx) => {
          if (collection.properties[field].isPartOfFormView) {
            return <FieldComponent id={field} index={idx} key={field} />;
          }
        })}
        {provided.placeholder}
      </Box>
    </ScrollContainer>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
  ]);

  return (
    <ScrollContainer>
      <Container borderRadius="2xLarge">
        <Box width="full" height="16" marginBottom="8">
          <Stack direction="vertical">
            <NameInput
              placeholder="Enter title"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <DescriptionInput
              placeholder="Enter description"
              autoFocus
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onBlur={async () => {
                const res = await updateFormCollection(collection.id, {
                  description,
                });
                res && updateCollection(res);
              }}
            />
          </Stack>
        </Box>
        <Droppable droppableId="activeFields" type="field">
          {FieldDraggableCallback}
        </Droppable>
      </Container>
    </ScrollContainer>
  );
}

export default memo(ColumnComponent);
