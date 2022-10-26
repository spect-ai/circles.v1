import { Box, Input, Stack, useTheme } from "degen";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import { useMutation } from "react-query";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "./CircleContext";
import { updateFolder } from "@/app/services/Folders";

type CreateCollectionDto = {
  name: string;
  private: boolean;
  circleId: string;
  defaultView?: "form" | "table" | "kanban" | "list" | "gantt";
};

interface Props {
  folderId: string;
  setCollectionModal: (value: boolean) => void;
}

function CreateCollectionModal({ folderId, setCollectionModal }: Props) {
  const close = () => setCollectionModal(false);

  const [name, setName] = useState("");

  const router = useRouter();
  const { circle, fetchCircle } = useCircle();

  const { mutateAsync, isLoading } = useMutation(
    (circle: CreateCollectionDto) => {
      return fetch(`${process.env.API_HOST}/collection/v1`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(circle),
        credentials: "include",
      });
    }
  );

  const onSubmit = () => {
    mutateAsync({
      name,
      private: false,
      circleId: circle?.id,
      defaultView: "form",
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void router.push(`/${circle?.slug}/r/${resJson.slug}`);
        void close();
        if (folderId) {
          const prev = Array.from(circle?.folderDetails[folderId]?.contentIds);
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
      })
      .catch((err) => console.log({ err }));
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your collection" />
      <Modal handleClose={close} title="Create Form" size="small">
        <Box width="full" padding="8">
          <Stack>
            <Input
              label=""
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Box width="full" marginTop="4">
              <PrimaryButton onClick={onSubmit} disabled={name.length === 0}>
                Create Form
              </PrimaryButton>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default CreateCollectionModal;
