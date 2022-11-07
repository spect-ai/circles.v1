import { Box, Stack, Text } from "degen";
import { memo, useCallback } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import FormSettings from "../FormSettings";
import InactiveFieldComponent from "../InactiveField";

const Container = styled(Box)`
  width: 25%;
  @media (max-width: 992px) {
    width: 100%;
    margin-bottom: 2rem;
  }
`;

type Props = {
  fields: string[];
};

function InactiveFieldsColumnComponent({ fields }: Props) {
  const { localCollection: collection } = useLocalCollection();
  const FieldDraggable = (provided: DroppableProvided) => (
    <Box {...provided.droppableProps} ref={provided.innerRef}>
      <Stack space="1">
        {fields?.map((field, idx) => {
          if (!collection.properties[field]?.isPartOfFormView) {
            return (
              <InactiveFieldComponent id={field} index={idx} key={field} />
            );
          }
        })}

        <Box height="4" />
        {provided.placeholder}
        <Box
          borderColor="foregroundSecondary"
          borderWidth="0.375"
          padding="2"
          borderRadius="medium"
        >
          <Text variant="label">
            Drag and drop fields above to remove them from the form view
          </Text>
        </Box>
      </Stack>
    </Box>
  );

  const FieldDraggableCallback = useCallback(FieldDraggable, [
    fields,
    collection.properties,
  ]);

  return (
    <Container>
      <Stack space="4">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Inactive Fields
        </Text>

        <Droppable droppableId="inactiveFields" type="field">
          {FieldDraggableCallback}
        </Droppable>
        <FormSettings />
      </Stack>
    </Container>
  );
}

export default memo(InactiveFieldsColumnComponent);
