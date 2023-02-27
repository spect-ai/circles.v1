import { Box, Input, MediaPicker, Stack } from "degen";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import { useMutation } from "react-query";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { useCircle } from "./CircleContext";
import { updateFolder } from "@/app/services/Folders";

type CreateWorkspaceDto = {
  name: string;
  description: string;
  private: boolean;
  parent: string;
  avatar: string;
};

interface Props {
  setWorkstreamModal: (a: boolean) => void;
  folderId?: string;
}

function CreateSpaceModal({ setWorkstreamModal, folderId }: Props) {
  const [visibilityTab, setVisibilityTab] = useState(0);
  const close = () => setWorkstreamModal(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { circle, fetchCircle } = useCircle();

  const [logo, setLogo] = useState(circle?.avatar || "");
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  const { mutateAsync, isLoading } = useMutation(
    (circle: CreateWorkspaceDto) => {
      return fetch(`${process.env.API_HOST}/circle/v1`, {
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
    setLoading(true);
    mutateAsync({
      name,
      description,
      private: visibilityTab === 1,
      parent: circle?.id,
      avatar: logo,
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void router.push(`/${resJson.slug}`);
        void close();
        if (resJson.id && folderId) {
          const prev = Array.from(circle?.folderDetails[folderId]?.contentIds);
          prev.push(resJson.id);
          const payload = {
            contentIds: prev,
          };
          console.log(payload);
          await updateFolder(payload, circle?.id, folderId);
        }

        if (resJson.id && !folderId && circle?.folderOrder.length !== 0) {
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
          console.log(payload);
          await updateFolder(payload, circle?.id, folder?.[0] as string);
        }
        fetchCircle();
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };

  const uploadFile = async (file: File) => {
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file);
      console.log({ imageGatewayURL });
      setLogo(imageGatewayURL);
      setUploading(false);
    }
  };

  return (
    <Modal handleClose={close} title="Create Workstream">
      <Box width="full" padding="8">
        <Stack>
          <Input
            label=""
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label=""
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <MediaPicker
            compact
            defaultValue={{
              type: "image/png",
              url: logo,
            }}
            label="Choose or drag and drop media"
            uploaded={!!logo}
            onChange={uploadFile}
            uploading={uploading}
            maxSize={10}
          />
          <Box width="full" marginTop="4">
            <PrimaryButton
              onClick={onSubmit}
              disabled={name.length === 0}
              loading={loading}
            >
              Create Workstream
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

export default CreateSpaceModal;
