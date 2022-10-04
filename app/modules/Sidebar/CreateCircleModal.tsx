import { Box, Button, IconPlus, Input, MediaPicker, Stack, Text } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "@/app/common/components/Modal";
import { storeImage } from "@/app/common/utils/ipfs";
import Tabs from "@/app/common/components/Tabs";
import Loader from "@/app/common/components/Loader";
import { useMutation } from "react-query";
import { generateColorHEX } from "@/app/common/utils/utils";

type CreateCircleDto = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  gradient: string;
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
    return fetch(`${process.env.API_HOST}/circle/v1`, {
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
      <Loader loading={isLoading} text="Creating your circle" />
      <Box>
        <Button
          shape="circle"
          variant="transparent"
          size="small"
          onClick={open}
          data-tour="create-circle-sidebar-button"
        >
          <Text color="accent">
            <IconPlus />
          </Text>
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
                <Input
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
                  maxSize={10}
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
                    width="full"
                    size="small"
                    variant="secondary"
                    disabled={uploading}
                    onClick={() => {
                      const color1 = generateColorHEX();
                      const color2 = generateColorHEX();
                      const color3 = generateColorHEX();
                      const gradient = `linear-gradient(300deg, ${color1}, ${color2}, ${color3})`;
                      mutateAsync({
                        name,
                        description,
                        avatar: logo,
                        private: visibilityTab === 1,
                        gradient,
                      })
                        .then(async (res) => {
                          const resJson = await res.json();
                          console.log({ resJson });
                          void router.push(`/${resJson.slug}`);
                          close();
                        })
                        .catch((err) => console.log({ err }));
                    }}
                  >
                    Create Circle
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
