import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Text } from "degen";
import React, { useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function GoogleCaptcha({ handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  return (
    <Modal title="Captcha" handleClose={handleClose} size="small">
      <Box padding="8" paddingTop="4">
        <Text variant="base" color={"textSecondary"}>
          Prevent bots from responding to this form with a simple captcha
        </Text>
        <Box paddingTop="4">
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
                logError(res.message);
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
}
