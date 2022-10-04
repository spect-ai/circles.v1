import { Box, Stack } from "degen";
import { memo, useCallback } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import InactiveFieldComponent from "../InactiveField";

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
  border-radius: 0.5rem;
  overflow-y: auto;
`;

type Props = {
  fields: string[];
};

function InactiveFieldsColumnComponent({ fields }: Props) {
  const { updateCollection } = useLocalCollection();

  const FieldDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Stack space="1">
        {fields?.map((field, idx) => {
          if (field) {
            return (
              <InactiveFieldComponent id={field} index={idx} key={field} />
            );
          }
        })}
        {provided.placeholder}
      </Stack>
    </ScrollContainer>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [fields]);

  return (
    <Container>
      <Stack space="2">
        <Droppable droppableId="inactiveFields" type="field">
          {FieldDraggableCallback}
        </Droppable>
        <AddField />
      </Stack>
    </Container>
  );
}

export default memo(InactiveFieldsColumnComponent);
