import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Text } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  handleClose: () => void;
};

export default function ResponderProfile({ handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  return (
    <Modal title="Responder Profile" handleClose={handleClose}>
      <Box padding="8">
        <Box marginBottom="4">
          <Text variant="base">
            Enabling this plugin will automatically collect responders'
            profiles.{" "}
          </Text>
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
                  walletConnectionRequired: true,
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
