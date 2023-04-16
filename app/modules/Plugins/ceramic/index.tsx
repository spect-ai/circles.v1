import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function Ceramic({ handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  return (
    <Modal title="Ceramic" handleClose={handleClose}>
      <Box padding="8">
        <Box width="1/2">
          <PrimaryButton
            loading={loading}
            variant={
              collection.formMetadata.ceramicEnabled ? "tertiary" : "secondary"
            }
            onClick={async () => {
              setLoading(true);
              const res = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  ceramicEnabled: !collection.formMetadata.ceramicEnabled,
                  walletConnectionRequired: true,
                },
              });
              if (res.id) updateCollection(res);
              else logError("Error updating collection");
              handleClose();
              setLoading(false);
            }}
          >
            {collection.formMetadata.ceramicEnabled
              ? "Disable Ceramic"
              : "Enable Ceramic"}
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
