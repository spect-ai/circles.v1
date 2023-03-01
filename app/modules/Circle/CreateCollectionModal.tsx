import { Box, Input, Stack, useTheme } from "degen";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import { useMutation } from "react-query";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "./CircleContext";
import { updateFolder } from "@/app/services/Folders";
import { AnimatePresence } from "framer-motion";
import TemplateModal from "./CircleOverview/FolderView/TemplateModal";

type CreateCollectionDto = {
  name: string;
  private: boolean;
  circleId: string;
  defaultView?: "form" | "table" | "kanban" | "list" | "gantt";
  collectionType?: 0 | 1;
};

interface Props {
  folderId?: string;
  setCollectionModal: (value: boolean) => void;
  collectionType: 0 | 1;
}

function CreateCollectionModal({
  folderId,
  setCollectionModal,
  collectionType,
}: Props) {
  const close = () => setCollectionModal(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const [name, setName] = useState("");

  const router = useRouter();
  const { circle, fetchCircle } = useCircle();
  const [loading, setLoading] = useState(false);

  const { mutateAsync, isLoading } = useMutation(
    (createDto: CreateCollectionDto) => {
      return fetch(`${process.env.API_HOST}/collection/v1`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(createDto),
        credentials: "include",
      });
    }
  );

  const onSubmit = () => {
    if (circle) {
      setLoading(true);
      mutateAsync({
        name,
        private: false,
        circleId: circle?.id,
        defaultView: collectionType === 0 ? "form" : "table",
        collectionType,
      })
        .then(async (res) => {
          const resJson = await res.json();
          console.log({ resJson });
          void router.push(`/${circle?.slug}/r/${resJson.slug}`);
          void close();
          if (folderId) {
            const prev = Array.from(
              circle?.folderDetails[folderId]?.contentIds
            );
            prev.push(resJson.id);
            const payload = {
              contentIds: prev,
            };
            void updateFolder(payload, circle?.id, folderId).then(
              () => void fetchCircle()
            );
          } else if (circle?.folderOrder.length !== 0) {
            const folder = Object.entries(circle?.folderDetails)?.find(
              (pair) => pair[1].avatar === "All"
            );
            const prev = Array.from(
              circle?.folderDetails[folder?.[0] as string]?.contentIds
            );
            prev.push(resJson.id);
            const payload = {
              contentIds: prev,
            };
            void updateFolder(payload, circle?.id, folder?.[0] as string).then(
              () => void fetchCircle()
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <Box>
      <AnimatePresence>
        {templateModalOpen && (
          <TemplateModal
            handleClose={() => {
              close();
            }}
          />
        )}
      </AnimatePresence>
      {!templateModalOpen && (
        <Modal
          handleClose={close}
          title={
            collectionType === 0 ? "Create a new form" : "Create a new project"
          }
        >
          <Box width="full" padding="8">
            <Stack>
              <Input
                label=""
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Stack>
                <PrimaryButton
                  onClick={onSubmit}
                  disabled={name.length === 0}
                  loading={loading}
                >
                  {collectionType === 0
                    ? "Create empty form"
                    : "Create empty project"}
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => {
                    setTemplateModalOpen(true);
                  }}
                >
                  Use a template Instead
                </PrimaryButton>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default CreateCollectionModal;
