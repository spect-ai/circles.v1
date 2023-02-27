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
import styled from "styled-components";
import Roles from "../RolesModal/Roles";
import SidebarConfig from "./SidebarConfig";
interface Props {
  handleClose: () => void;
  initialTab?: number;
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 10px;
  }
  height: 35rem;
  overflow-y: auto;
`;

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

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await updateCircle(
      {
        name,
        description,
        avatar: logo,
        private: visibilityTab === 1,
      },
      circle?.id
    );
    setIsLoading(false);
    if (res) {
      handleClose();
      setCircleData(res);
    }
  };

  const onDelete = async () => {
    const res = await deleteCircle(circle?.id);
    if (res) {
      handleClose();
      void router.push("/");
    }
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
    <Modal
      title={circle?.parents?.length ? "Workstream Settings" : "Space Settings"}
      handleClose={handleClose}
      height="40rem"
      size="large"
      zIndex={3}
    >
      <Box
        display="flex"
        style={{
          height: "calc(100% - 5rem)",
        }}
      >
        <Box width="1/4" paddingY="8" paddingRight="1">
          <Tabs
            selectedTab={tab}
            onTabClick={onTabClick}
            tabs={[
              "Info",
              "Integrations",
              "Sidebar",
              "Credentials",
              "Roles",
              "Payments",
              "Archive",
            ]}
            tabTourIds={[
              "circle-settings-info",
              "circle-settings-integrations",
              "circle-settings-sidebar",
              "circle-settings-credentials",
              "circle-settings-roles",
              "circle-settings-payments",
              "circle-settings-delete",
            ]}
            orientation="vertical"
            unselectedColor="transparent"
          />
        </Box>
        <ScrollContainer
          width="3/4"
          paddingX={{
            xs: "2",
            md: "4",
            lg: "8",
          }}
          paddingY="4"
        >
          {tab === 0 && (
            <Stack>
              <Input
                label=""
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                label=""
                placeholder=" Description"
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
              {/* <Tabs
                selectedTab={visibilityTab}
                onTabClick={onVisibilityTabClick}
                tabs={["Public", "Private"]}
                orientation="horizontal"
                unselectedColor="transparent"
              /> */}
              <Box marginTop="4" width="full">
                <PrimaryButton
                  onClick={onSubmit}
                  loading={isLoading}
                  disabled={uploading}
                  shape="circle"
                >
                  Update Org
                </PrimaryButton>
              </Box>
            </Stack>
          )}
          {tab === 1 && <CircleIntegrations />}
          {tab === 2 && <SidebarConfig />}
          {tab === 3 && <Credentials />}
          {tab === 4 && <Roles />}
          {tab === 5 && <DefaultPayment />}
          {tab === 6 && (
            <Box width="full">
              <Stack>
                <Box>
                  <Text align="center" weight="semiBold" size="extraLarge">
                    Danger, this will also archive everything within this
                    organization!
                  </Text>
                </Box>
                <PrimaryButton
                  onClick={onDelete}
                  disabled={uploading}
                  tone="red"
                >
                  Archive Org
                </PrimaryButton>
              </Stack>
            </Box>
          )}
        </ScrollContainer>
      </Box>
    </Modal>
  );
}
