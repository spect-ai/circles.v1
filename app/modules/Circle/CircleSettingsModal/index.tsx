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
import styled from "styled-components";
import Roles from "../RolesModal/Roles";
import SidebarConfig from "./SidebarConfig";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { toast } from "react-toastify";
interface Props {
  handleClose: () => void;
  initialTab?: number;
}

const ScrollContainer = styled(Box)`
  @media (max-width: 768px) {
    overflow-y: visible;
  }

  ::-webkit-scrollbar {
    width: 0px;
  }
  height: 45rem;
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
      circle?.id || ""
    );
    setIsLoading(false);
    if (res) {
      handleClose();
      setCircleData(res);
    }
  };

  const onDelete = async () => {
    const res = await deleteCircle(circle?.id || "");
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
    <Box>
      {isConfirmOpen && (
        <ConfirmModal
          title="All forms, projects and associated data will be archived. Are you sure you want to archive this space? "
          onConfirm={async () => {
            setIsConfirmOpen(false);
            await onDelete();
          }}
          handleClose={() => setIsConfirmOpen(false)}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
      <Modal
        title={
          circle?.parents?.length ? "Workstream Settings" : "Space Settings"
        }
        handleClose={handleClose}
        height="40rem"
        size="large"
        zIndex={3}
      >
        <Box
          display="flex"
          style={{
            height: "calc(100% - 1rem)",
          }}
          flexDirection={{
            xs: "column",
            md: "row",
          }}
        >
          <Box
            width={{
              xs: "full",
              md: "1/4",
            }}
            paddingY="8"
            paddingRight={{
              xs: "0",
              md: "1",
            }}
          >
            <Tabs
              selectedTab={tab}
              onTabClick={onTabClick}
              tabs={[
                "Info",
                "Integrations",
                "Sidebar",
                "Roles",
                "Payments",
                "Archive",
              ]}
              tabTourIds={[
                "circle-settings-info",
                "circle-settings-integrations",
                "circle-settings-sidebar",
                "circle-settings-roles",
                "circle-settings-payments",
                "circle-settings-delete",
              ]}
              orientation="vertical"
              unselectedColor="transparent"
            />
          </Box>
          <ScrollContainer
            width={{
              xs: "full",
              md: "3/4",
            }}
            paddingX={{
              xs: "4",
              md: "6",
              lg: "8",
            }}
            paddingY="4"
          >
            {tab === 0 && (
              <Stack>
                <Stack space="0">
                  <Text variant="label">Name</Text>
                  <Input
                    label
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Stack>
                <Stack space="0">
                  <Text variant="label">About</Text>
                  <Textarea
                    label
                    placeholder=" Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Stack>
                <Stack space="2">
                  <Text variant="label">Logo</Text>
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
                </Stack>
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
                    Update Space
                  </PrimaryButton>
                </Box>
              </Stack>
            )}
            {tab === 1 && <CircleIntegrations />}
            {tab === 2 && <SidebarConfig />}
            {/* {tab === 3 && <Credentials />} */}
            {tab === 3 && <Roles />}
            {tab === 4 && <DefaultPayment />}
            {tab === 5 && (
              <Box width="1/2">
                <Stack>
                  <Box>
                    <Text align="left" weight="semiBold" size="large">
                      Danger, this will also archive everything within this
                      space!
                    </Text>
                  </Box>
                  <PrimaryButton
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={uploading}
                    tone="red"
                  >
                    Archive Space
                  </PrimaryButton>
                </Stack>
              </Box>
            )}
          </ScrollContainer>
        </Box>
      </Modal>
    </Box>
  );
}
