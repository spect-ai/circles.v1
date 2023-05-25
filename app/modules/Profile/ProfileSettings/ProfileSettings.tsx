import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { SaveFilled } from "@ant-design/icons";
import { Box } from "degen";
import React, { useState } from "react";
import Tabs from "@/app/common/components/Tabs";
import styled from "styled-components";
import { BasicInfo } from "./Basic";
import { About } from "./About";
import { useProfile } from "./LocalProfileContext";
import { Notification } from "./Notificaton";
import { Socials } from "./Socials";
import APIAccess from "./APIAccess";

const ScrollContainer = styled(Box)`
  @media (max-width: 768px) {
    overflow-y: visible;
  }
  ::-webkit-scrollbar {
    overflow-y: visible;
  }
  height: 35rem;
  overflow-y: auto;
`;

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  openTab?: number;
}

export default function ProfileSettings({ setIsOpen, openTab }: Props) {
  const [tab, setTab] = useState(openTab || 0);
  const onTabClick = (id: number) => setTab(id);

  const {
    loading,
    username,
    isDirty,
    uploading,
    setIsDirty,
    onSaveProfile,
    usernameError,
  } = useProfile();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Profile Settings"
      handleClose={handleClose}
      zIndex={2}
      height="calc(100% - 20rem)"
    >
      <Box
        display="flex"
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
          paddingRight="1"
        >
          <Tabs
            selectedTab={tab}
            onTabClick={onTabClick}
            tabs={["Basic", "About", "Notification", "Socials", "API Access"]}
            tabTourIds={[
              "profile-settings-basic",
              "profile-settings-about",
              "profile-settings-notification",
              "profile-settings-socials",
              "profile-settings-api",
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
            xs: "2",
            md: "4",
            lg: "8",
          }}
          paddingY="4"
        >
          {tab == 0 && <BasicInfo />}
          {tab == 1 && <About />}
          {tab == 2 && <Notification />}
          {tab == 3 && <Socials />}
          {tab == 4 && <APIAccess />}
        </ScrollContainer>
      </Box>
      <Box padding="3">
        <PrimaryButton
          disabled={
            !isDirty || uploading || !username || usernameError.length > 0
          }
          loading={loading}
          icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
          onClick={() => {
            handleClose();
            onSaveProfile();
            setIsDirty(false);
          }}
        >
          Save Profile
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
