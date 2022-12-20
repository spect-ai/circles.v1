import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  deleteCollection,
  updateFormCollection,
} from "@/app/services/Collection";
import { Box, Button, IconCog, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Archive } from "react-feather";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function Settings() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(collection.name);

  const router = useRouter();

  return (
    <Box>
      <Button
        shape="circle"
        onClick={() => setIsOpen(!isOpen)}
        size="small"
        variant="transparent"
      >
        <Text variant="label">
          <IconCog />
        </Text>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Settings"
            handleClose={() => {
              setIsOpen(false);
              updateFormCollection(collection.id, { name })
                .then((res) => {
                  if (res.id) updateCollection(res);
                  else toast.error("Error updating collection name");
                })
                .catch(() => {
                  toast.error("Error updating collection name");
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
                      icon={<Archive size={16} style={{ marginTop: 2 }} />}
                      tone="red"
                      onClick={() => {
                        if (
                          !confirm(
                            "Are you sure you want to archive this collection?"
                          )
                        )
                          return;
                        void updateFormCollection(collection.id, {
                          archived: true,
                        }).then((res) => {
                          console.log({ res });
                          if (res.id) {
                            toast.success("Collection archived");
                            void router.push(`/${router.query.circle}`);
                          } else {
                            toast.error("Error archiving collection");
                          }
                        });
                      }}
                    >
                      Archive
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}
