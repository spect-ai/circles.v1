import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Input, Stack, Text } from "degen";
import React, { useState } from "react";
import { Archive } from "react-feather";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function ViewSettings({ handleClose }: Props) {
  const {
    localCollection: collection,
    updateCollection,
    projectViewId,
    setProjectViewId,
  } = useLocalCollection();
  const [name, setName] = useState(
    collection.projectMetadata.views[projectViewId]?.name
  );
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="View Settings"
      handleClose={() => {
        handleClose();
        updateFormCollection(collection.id, {
          projectMetadata: {
            ...collection.projectMetadata,
            views: {
              ...collection.projectMetadata.views,
              [projectViewId]: {
                ...collection.projectMetadata.views[projectViewId],
                name,
              },
            },
          },
        })
          .then((res) => {
            if (res.id) updateCollection(res);
            else logError("Error updating view name");
          })
          .catch(() => {
            logError("Error updating view name");
          });
      }}
    >
      <Box padding="8">
        <Stack>
          <Input
            label=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Text variant="label">Danger</Text>
          <Stack direction="horizontal">
            <Box width="1/2">
              <PrimaryButton
                loading={loading}
                icon={<Archive size={16} style={{ marginTop: 2 }} />}
                tone="red"
                onClick={async () => {
                  if (projectViewId === "0x0") {
                    toast.warn("Cannot delete default view");
                    return;
                  }

                  if (
                    !confirm(
                      "Are you sure you want to delete this view? This cannot be undone."
                    )
                  )
                    return;
                  setLoading(true);
                  delete collection.projectMetadata.views[projectViewId];
                  collection.projectMetadata.viewOrder =
                    collection.projectMetadata.viewOrder.filter(
                      (id) => id !== projectViewId
                    );
                  const res = await updateFormCollection(collection.id, {
                    projectMetadata: {
                      ...collection.projectMetadata,
                      views: collection.projectMetadata.views,
                      viewOrder: collection.projectMetadata.viewOrder,
                    },
                  });
                  if (res.id) {
                    handleClose();
                    setProjectViewId("0x0");
                    updateCollection(res);
                  } else {
                    logError("Error deleting view");
                  }
                  setLoading(false);
                }}
              >
                Delete View
              </PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
