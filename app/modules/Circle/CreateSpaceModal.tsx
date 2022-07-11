import { Box, Button, IconPlusSmall, Input, MediaPicker, Stack } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import { useMutation, useQuery } from "react-query";
import { CircleType } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";

type CreateWorkspaceDto = {
  name: string;
  description: string;
  private: boolean;
  parent: string;
  avatar: string;
};

function CreateSpaceModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, refetch } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [logo, setLogo] = useState(circle?.avatar || "");
  const [uploading, setUploading] = useState(false);

  const { mutateAsync, isLoading } = useMutation(
    (circle: CreateWorkspaceDto) => {
      return fetch(`${process.env.API_HOST}/circle`, {
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
      description,
      private: visibilityTab === 1,
      parent: circle?.id as string,
      avatar: logo,
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void refetch();
        void router.push(`/${resJson.slug}`);
        void close();
      })
      .catch((err) => console.log({ err }));
  };

  const uploadFile = async (file: File) => {
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file, "circleLogo");
      console.log({ imageGatewayURL });
      setLogo(imageGatewayURL);
      setUploading(false);
    }
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your workstream" />

      <Button
        data-tour="circle-sidebar-create-space-button"
        size="small"
        variant="transparent"
        shape="circle"
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
        }}
      >
        <IconPlusSmall />
      </Button>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title="Create Workspace">
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
                <Tabs
                  selectedTab={visibilityTab}
                  onTabClick={onVisibilityTabClick}
                  tabs={["Public", "Private"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                />
                <Box width="full" marginTop="4">
                  <PrimaryButton onClick={onSubmit}>
                    Create Workspace
                  </PrimaryButton>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default CreateSpaceModal;
