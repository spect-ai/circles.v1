import { smartTrim } from "@/app/common/utils/utils";
import { UserType } from "@/app/types";
import { Box, Button, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useGlobal } from "@/app/context/globalContext";
import { SettingOutlined, BellOutlined } from "@ant-design/icons";
import ProfileModal from "../../Profile/ProfilePage/ProfileModal";

const Container = styled(Box)<{ mode: string }>`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

export default function ProfileButton() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { openQuickProfile, setTab } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useTheme();

  const [notifIds, setNotifIds] = useState([] as string[]);

  useEffect(() => {
    if ((currentUser as UserType)?.notifications?.length > 0) {
      currentUser?.notifications?.map((notif) => {
        if (notif.read == false) setNotifIds([...notifIds, notif.id]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.notifications]);

  return (
    <>
      <Box
        borderTopWidth="0.375"
        paddingTop="2"
        marginX="4"
        display={"flex"}
        flexDirection="row"
        gap="1"
        alignItems="center"
      >
        <Container
          onClick={() => {
            setTab("Work");
            openQuickProfile((currentUser as UserType).id);
          }}
          data-tour="profile-header-button"
          padding="1"
          borderRadius="large"
          width="full"
          mode={mode}
        >
          <Stack direction="horizontal">
            <Stack space="1">
              <Text>{currentUser?.username}</Text>
              <Text size="small" variant="label">
                {smartTrim(currentUser?.ethAddress as string, 12)}
              </Text>
            </Stack>
          </Stack>
        </Container>
        <Button
          shape="circle"
          size="small"
          variant="transparent"
          onClick={() => setIsOpen(true)}
        >
          <SettingOutlined
            style={{ color: "rgb(191, 90, 242, 0.8)", fontSize: "1.2rem" }}
          />
        </Button>
        <Button
          shape="circle"
          size="small"
          variant="transparent"
          onClick={() => {
            setTab("Notifications");
            openQuickProfile((currentUser as UserType).id);
            setNotifIds([]);
          }}
        >
          {notifIds.length > 0 && (
            <div
              style={{
                backgroundColor: "rgb(191, 90, 242, 1)",
                height: "0.5rem",
                width: "0.5rem",
                zIndex: 10,
                borderRadius: "3rem",
                position: "absolute",
                margin: "0px 8px 0px 15px",
              }}
            />
          )}
          <Box position="relative">
            <BellOutlined
              style={{ color: "rgb(191, 90, 242, 0.8)", fontSize: "1.2rem" }}
            />
          </Box>
        </Button>
      </Box>
      <AnimatePresence>
        {isOpen && <ProfileModal setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </>
  );
}
