import { Box, Stack, Text } from "degen";
import { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
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
  margin-top: 4rem;
  border-width: 0.2rem;
  padding: 2rem;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 6rem);
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
  font-weight: 600;
`;

type Props = {
  fields: string[];
};

function ColumnComponent({ fields }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const FieldDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Box>
        {fields?.map((field, idx) => {
          if (field) {
            return <FieldComponent id={field} index={idx} key={field} />;
          }
        })}
        {provided.placeholder}
      </Box>
    </ScrollContainer>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [fields]);

  return (
    <ScrollContainer>
      <Container>
        <Box width="full" height="16" marginBottom="8">
          <Stack direction="vertical">
            <NameInput
              placeholder="Enter title"
              autoFocus
              value={collection.name}
              onChange={(e) => {
                setIsDirty(true);
                //setTitle(e.target.value);
              }}
            />
            <DescriptionInput
              placeholder="Enter description"
              autoFocus
              value={collection.description}
              onChange={(e) => {
                setIsDirty(true);
                //setTitle(e.target.value);
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
