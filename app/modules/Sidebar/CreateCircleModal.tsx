import {
  Box,
  Button,
  IconPlus,
  Input,
  MediaPicker,
  Stack,
  Text,
  Textarea,
} from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "@/app/common/components/Modal";
import { storeImage } from "@/app/common/utils/ipfs";
import Tabs from "@/app/common/components/Tabs";
import Loader from "@/app/common/components/Loader";
import { useMutation } from "react-query";

type CreateCircleDto = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
};

function CreateCircle() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const { mutateAsync, isLoading } = useMutation((circle: CreateCircleDto) => {
    return fetch("http://localhost:3000/circle", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(circle),
      credentials: "include",
    });
  });

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
      <Loader loading={isLoading} text="Creating your tribe" />
      <Box paddingY="3">
        <Button shape="circle" variant="secondary" size="small" onClick={open}>
          <IconPlus />
        </Button>
      </Box>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title="Create Circle">
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Circle Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  label=""
                  placeholder="Circle Description"
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
                />
                <Tabs
                  selectedTab={visibilityTab}
                  onTabClick={onVisibilityTabClick}
                  tabs={["Public", "Private"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    width="1/2"
                    size="small"
                    variant="primary"
                    disabled={uploading}
                    onClick={async () =>
                      mutateAsync({
                        name,
                        description,
                        avatar: logo,
                        private: visibilityTab === 1,
                      })
                        .then(async (res) => {
                          const resJson = await res.json();
                          console.log({ resJson });
                          void router.push(`/${resJson.slug}`);
                        })
                        .catch((err) => console.log({ err }))
                    }
                  >
                    <Text>Create Circle</Text>
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default CreateCircle;
