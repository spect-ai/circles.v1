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
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 0px;
  }
  height: calc(100vh - 6rem);
  border-radius: 0.5rem;
  overflow-y: auto;
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
    <>
      <Container>
        <Droppable droppableId="activeFields" type="field">
          {FieldDraggableCallback}
        </Droppable>
      </Container>
    </>
  );
}

export default memo(ColumnComponent);
