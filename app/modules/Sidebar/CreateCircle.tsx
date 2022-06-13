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
import { Web3Storage } from "web3.storage";
import { storeImage } from "@/app/common/utils/ipfs";
import Tabs from "@/app/common/components/Tabs";

function CreateCircle() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const uploadFile = async (file: File) => {
    console.log("uploading file");
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file, "circleLogo");
      console.log({ imageGatewayURL });
      setLogo(imageGatewayURL);
      setUploading(false);
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    //   runMoralisFunction('createTribe', {
    //     name,
    //     description,
    //     isPublic: visibilityTab === 0,
    //     logo,
    //   })
    //     .then((res: any) => {
    //       console.log(res);
    //       setIsLoading(false);
    //       close();
    //       router.push({
    //         pathname: `/tribe/${res.get('teamId')}`,
    //       });
    //     })
    //     .catch((err: any) => {
    //       setIsLoading(false);
    //       close();
    //       console.log({ err });
    //     });
  };

  return (
    <>
      {/* <Loader loading={isLoading} text="Creating your tribe" /> */}
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
          <Modal handleClose={close} title="Create Tribe">
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Tribe Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  label=""
                  placeholder="Tribe Description"
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
                    onClick={onSubmit}
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
