import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Archive as ArchiveIcon } from "react-feather";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";

type Props = {};

export default function Archive({}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { localCollection: collection } = useLocalCollection();
  const router = useRouter();
  return (
    <Box>
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmModal
            title={
              collection.collectionType === 0
                ? "Are you sure you want to archive this form?"
                : "Are you sure you want to archive this project?"
            }
            onConfirm={() => {
              void updateFormCollection(collection.id, {
                archived: true,
                formMetadata: {
                  ...collection.formMetadata,
                  active: false,
                },
              }).then((res) => {
                console.log({ res });
                if (res.id) {
                  toast.success("Archived successfully");
                  setIsConfirmOpen(false);
                  void router.push(`/${router.query.circle}`);
                } else {
                  logError("Error archiving collection");
                }
              });
            }}
            handleClose={() => setIsConfirmOpen(false)}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </AnimatePresence>
      <Stack space="1">
        <Text align="left" weight="semiBold" size="large">
          Danger, this will also archive associated automations, if there are
          any.
        </Text>
        <Box width="1/2" marginTop="4">
          <PrimaryButton
            icon={<ArchiveIcon size={16} style={{ marginTop: 2 }} />}
            tone="red"
            onClick={() => {
              setIsConfirmOpen(true);
            }}
          >
            Archive
          </PrimaryButton>
        </Box>
      </Stack>
    </Box>
  );
}
