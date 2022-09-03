import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { storeImage } from "@/app/common/utils/ipfs";
import { deleteCircle, updateCircle } from "@/app/services/UpdateCircle";
import { Box, Input, MediaPicker, Stack, Text, Textarea } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CircleIntegrations from "./CircleIntegrations";
import DefaultPayment from "./CirclePayment";
import Contributors from "../ContributorsModal/Contributors";
import { useCircle } from "../CircleContext";
import Credentials from "./Credentials";
interface Props {
  handleClose: () => void;
  initialTab?: number;
}

export default function SettingsModal({ handleClose, initialTab }: Props) {
  const { circle, setCircleData } = useCircle();

  const [tab, setTab] = useState(initialTab || 0);
  const [visibilityTab, setVisibilityTab] = useState(circle?.private ? 1 : 0);
  const onTabClick = (id: number) => setTab(id);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);

  const [name, setName] = useState(circle?.name || "");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState(circle?.description || "");
  const [logo, setLogo] = useState(circle?.avatar || "");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log({ circle });

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await updateCircle(
      {
        name,
        description,
        avatar: logo,
        private: visibilityTab === 1,
      },
      circle?.id as string
    );
    setIsLoading(false);
    if (res) {
      handleClose();
      setCircleData(res);
    }
  };

  const onDelete = async () => {
    const res = await deleteCircle(circle?.id as string);
    if (res) {
      handleClose();
      void router.push("/");
    }
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
    <Modal
      title="Circle Settings"
      handleClose={handleClose}
      height="40rem"
      size="large"
    >
      <Box
        display="flex"
        style={{
          height: "calc(100% - 5rem)",
        }}
      >
        <Box width="1/4" borderRightWidth="0.375" paddingY="8" paddingRight="1">
          <Tabs
            selectedTab={tab}
            onTabClick={onTabClick}
            tabs={[
              "Info",
              "Integrations",
              "Credentials",
              "Payments",
              "Contributors",
              "Archive",
            ]}
            tabTourIds={[
              "circle-settings-info",
              "circle-settings-integrations",
              "circle-settings-payments",
              "circle-settings-members",
              "circle-settings-delete",
            ]}
            orientation="vertical"
            unselectedColor="transparent"
          />
        </Box>
        <Box width="3/4" paddingX="8" paddingY="4">
          {tab === 0 && (
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
                maxSize={10}
              />
              <Tabs
                selectedTab={visibilityTab}
                onTabClick={onVisibilityTabClick}
                tabs={["Public", "Private"]}
                orientation="horizontal"
                unselectedColor="transparent"
              />
              <Box marginTop="4" width="full">
                <PrimaryButton
                  onClick={onSubmit}
                  loading={isLoading}
                  disabled={uploading}
                  shape="circle"
                >
                  Update Circle
                </PrimaryButton>
              </Box>
            </Stack>
          )}
          {tab === 1 && <CircleIntegrations />}
          {tab === 2 && <Credentials />}
          {tab === 3 && <DefaultPayment />}
          {tab === 4 && <Contributors />}
          {tab === 5 && (
            <Box width="full">
              <Stack>
                <Box>
                  <Text align="center" weight="semiBold" size="extraLarge">
                    Danger, this will also archive everything within the circle!
                  </Text>
                </Box>
                <PrimaryButton
                  onClick={onDelete}
                  disabled={uploading}
                  tone="red"
                >
                  Archive Circle
                </PrimaryButton>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
