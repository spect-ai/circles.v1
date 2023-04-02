import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { smartTrim } from "@/app/common/utils/utils";
import { updateFormCollection } from "@/app/services/Collection";
import { LookupToken } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import AddLookup from "./AddLookup";

type Props = {
  handleClose: () => void;
};

export default function ResponderProfile({ handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);

  const [lookupTokens, setLookupTokens] = useState<LookupToken[]>(
    collection.formMetadata.lookup?.tokens || []
  );

  return (
    <Modal title="Responder Profile" handleClose={handleClose}>
      <Box padding="8">
        <Box marginBottom="4">
          {/* <Text variant="base">
            Enabling this plugin will automatically collect responders'
            profiles.{" "}
          </Text> */}
          <Stack>
            <Text variant="label">On Chain data lookup</Text>
            <Stack direction="horizontal" wrap space="2">
              {lookupTokens.map((token, i) => (
                <Box
                  key={token.contractAddress}
                  borderWidth="0.375"
                  borderRadius="2xLarge"
                  cursor="pointer"
                  padding="2"
                  borderColor={
                    lookupTokens.find(
                      (t) => t.contractAddress === token.contractAddress
                    )
                      ? "accent"
                      : "foregroundSecondary"
                  }
                  style={{
                    width: "19%",
                  }}
                  onClick={() => {
                    setLookupTokens(
                      lookupTokens.filter(
                        (t) => t.contractAddress !== token.contractAddress
                      )
                    );
                  }}
                >
                  <Stack align="center">
                    <Avatar
                      src={
                        token.metadata.image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${token.metadata.name}`
                      }
                      label=""
                      shape="square"
                    />
                    <Text align="center">
                      {smartTrim(token.metadata.name, 20)}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <AddLookup
              lookupTokens={lookupTokens}
              setLookupTokens={setLookupTokens}
            />
          </Stack>
        </Box>

        <Box width="1/2">
          <PrimaryButton
            loading={loading}
            variant={
              collection.formMetadata.allowAnonymousResponses === false
                ? "tertiary"
                : "secondary"
            }
            onClick={async () => {
              setLoading(true);
              const res = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  allowAnonymousResponses:
                    !collection.formMetadata.allowAnonymousResponses,
                  lookup: {
                    tokens:
                      collection.formMetadata.allowAnonymousResponses === false
                        ? []
                        : lookupTokens,
                    snapshot: 0,
                  },
                },
              });
              if (res.id) updateCollection(res);
              else
                toast.error("Error updating collection, refresh and try again");
              handleClose();
              setLoading(false);
            }}
          >
            {collection.formMetadata.allowAnonymousResponses === false
              ? "Don't Collect Responder Profiles"
              : "Collect Responder Profiles"}
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
