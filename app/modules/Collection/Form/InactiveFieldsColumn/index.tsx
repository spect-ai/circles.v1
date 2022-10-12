import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Heading, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useState } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import AddField from "../../AddField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import InactiveFieldComponent from "../InactiveField";

const Container = styled(Box)`
  width: 25%;
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
  const { localCollection: collection } = useLocalCollection();
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const FieldDraggable = (provided: DroppableProvided) => (
    <ScrollContainer {...provided.droppableProps} ref={provided.innerRef}>
      <Stack space="1">
        {fields?.map((field, idx) => {
          if (!collection.properties[field].isPartOfFormView) {
            return (
              <InactiveFieldComponent id={field} index={idx} key={field} />
            );
          }
        })}
        <Box height="4" />
        {provided.placeholder}
      </Stack>
    </ScrollContainer>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
  ]);

  return (
    <Container>
      <Stack space="4">
        <Heading>Inactive Fields</Heading>
        <Droppable droppableId="inactiveFields" type="field">
          {FieldDraggableCallback}
        </Droppable>
        <AnimatePresence>
          {isAddFieldOpen && (
            <AddField handleClose={() => setIsAddFieldOpen(false)} />
          )}
          <PrimaryButton onClick={() => setIsAddFieldOpen(true)}>
            Add Field
          </PrimaryButton>
        </AnimatePresence>
      </Stack>
    </Container>
  );
}

export default memo(InactiveFieldsColumnComponent);
