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

const GoogleCaptcha = ({ handleClose }: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  return (
    <Modal title="Google Captcha" handleClose={handleClose}>
      <Box padding="8">
        <Box width="1/2">
          <PrimaryButton
            loading={loading}
            variant={
              collection.formMetadata.captchaEnabled ? "tertiary" : "secondary"
            }
            onClick={async () => {
              setLoading(true);
              const res = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  captchaEnabled: !collection.formMetadata.captchaEnabled,
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
            {collection.formMetadata.captchaEnabled
              ? "Disable Captcha"
              : "Enable Captcha"}
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default GoogleCaptcha;
