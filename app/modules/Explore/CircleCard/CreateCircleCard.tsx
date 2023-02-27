import { useState } from "react";

import { Box, Button, Input, MediaPicker, Stack, useTheme } from "degen";
import styled from "styled-components";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import Modal from "@/app/common/components/Modal";
import { storeImage } from "@/app/common/utils/ipfs";
import Tabs from "@/app/common/components/Tabs";
import { generateColorHEX } from "@/app/common/utils/utils";
import { AnimatePresence } from "framer-motion";
import { createDefaultProject } from "@/app/services/Defaults";

const Container = styled(Box)<{ mode: string }>`
  border: 0.1rem solid transparent;
  cursor: pointer;
  background-color: ${({ mode }) =>
    mode === "dark" ? "rgba(54, 34, 65, 1)" : "rgba(236,222,243, 1)"};
  color: rgb(191, 90, 242, 1);
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;

type CreateCircleDto = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  gradient: string;
};

const CreateCircleCard = () => {
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
  const { mode } = useTheme();

  const { mutateAsync } = useMutation((circle: CreateCircleDto) => {
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
      const { imageGatewayURL } = await storeImage(file);
      console.log({ imageGatewayURL });
      setLogo(imageGatewayURL);
      setUploading(false);
    }
  };

  return (
    <>
      <Container
        mode={mode}
        borderRadius="2xLarge"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginRight={{ xs: "2", md: "4" }}
        marginBottom={{ xs: "4", md: "8" }}
        transitionDuration="700"
        height="72"
        onClick={open}
      >
        Create a Space
      </Container>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title="Create Space" zIndex={2}>
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
                  label="Select Space Avatar"
                  uploaded={!!logo}
                  onChange={uploadFile}
                  uploading={uploading}
                  maxSize={10}
                />
                {/* <Tabs
                  selectedTab={visibilityTab}
                  onTabClick={onVisibilityTabClick}
                  tabs={["Public", "Private"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                /> */}
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
                          const response = await createDefaultProject(
                            resJson.id
                          );
                          if (response) {
                            void router.push(`/${resJson.slug}`);
                          }
                          close();
                        })
                        .catch((err) => console.log({ err }));
                    }}
                  >
                    Create Space
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateCircleCard;
