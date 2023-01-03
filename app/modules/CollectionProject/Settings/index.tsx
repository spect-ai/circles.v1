import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [name, setName] = useState(collection.name);

  const router = useRouter();

  return (
    <Box>
      {isConfirmOpen && (
        <ConfirmModal
          title="Are you sure you want to archive this collection?"
          onConfirm={() => {
            void updateFormCollection(collection.id, {
              archived: true,
            }).then((res) => {
              console.log({ res });
              if (res.id) {
                toast.success("Collection archived");
                setIsConfirmOpen(false);
                void router.push(`/${router.query.circle}`);
              } else {
                toast.error("Error archiving collection");
              }
            });
          }}
          handleClose={() => setIsConfirmOpen(false)}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
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
                        setIsConfirmOpen(true);
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
