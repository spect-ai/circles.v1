import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import { memo, useCallback } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import RoleGate from "../../RoleGate";
import SybilResistance from "../../SybilResistance";
import VotingModule from "../../VotingModule";
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
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
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
        <RoleGate />
        <SybilResistance />
        <VotingModule />
        <Stack>
          {collection.sybilProtectionEnabled && (
            <Text variant="small">{`This form has credential curation enabled!`}</Text>
          )}
          {!collection.sybilProtectionEnabled && (
            <Text variant="small">{`Receive responder's credentials across web3 along with their response`}</Text>
          )}
        </Stack>
        <PrimaryButton
          variant={
            collection.credentialCurationEnabled ? "tertiary" : "secondary"
          }
          onClick={async () => {
            const res = await (
              await fetch(
                `${process.env.API_HOST}/collection/v1/${collection.id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    credentialCurationEnabled:
                      !collection.credentialCurationEnabled,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              )
            ).json();
            updateCollection(res);
          }}
        >
          {collection.credentialCurationEnabled
            ? `Disable Credential Curation`
            : `Enable Credential Curation`}
        </PrimaryButton>
      </Stack>
    </Container>
  );
}

export default memo(InactiveFieldsColumnComponent);
