import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  handleClose: () => void;
};

const Ceramic = ({ handleClose }: Props) => {
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
              else {
                toast.error("Error updating collection, refresh and try again");
              }
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
};

export default Ceramic;
