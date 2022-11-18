import Drawer from "@/app/common/components/Drawer";
import { useGlobal } from "@/app/context/globalContext";
import { Notification } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import TaskWalletHeader from "../TaskWallet/TaskWalletHeader";

export default function NotificationPanel() {
  const { setIsProfilePanelExpanded } = useGlobal();
  const handleClose = () => setIsProfilePanelExpanded(false);
  const [tab, setTab] = useState(0);

  const { refetch } = useQuery<Notification[]>("notifications", {
    enabled: false,
  });

  const [notifications, setnotifications] = useState<Notification[]>([]);

  useEffect(() => {
    void refetch().then((res) => {
      // reverse the array so the latest notifications are at the top
      if (res.data) {
        console.log({ data: res.data });
        setnotifications(res.data.reverse());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ notifications });

  return (
    <Drawer
      handleClose={handleClose}
      width="700px"
      header={
        <Box paddingY="4">
          <TaskWalletHeader />
        </Box>
      }
      closeOnOutsideClick
    >
      <Box paddingX="8" paddingY="4">
        <Stack>
          <Box
            backgroundColor="backgroundSecondary"
            style={{
              borderRadius: "2rem",
              boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <ToggleButton
              onClick={() => setTab(0)}
              bgcolor={tab == 0 ? true : false}
            >
              Notifications
            </ToggleButton>
          </Box>
          {notifications?.reverse().map((notif) => (
            <NotificationItem key={notif.timestamp} notif={notif} />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}

const NotificationItem = ({ notif }: { notif: Notification }) => {
  return (
    <Link href={notif.redirect || "/"}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.4rem",
          alignItems: "center",
          cursor: "pointer",
          padding: "1rem",
          width: "39rem",
          borderRadius: "0.5rem",
        }}
        backgroundColor={
          notif?.read == false ? "accentTertiary" : "transparent"
        }
      >
        <Avatar label="profile-pic" src={notif.avatar} size="5" />
        <Text>{notif?.content}</Text>
        <Text variant="label">
          {new Date(notif?.timestamp).toLocaleDateString() ==
          new Date().toLocaleDateString()
            ? new Date(notif?.timestamp).toLocaleTimeString()
            : new Date(notif?.timestamp).toLocaleDateString()}
        </Text>
      </Box>
    </Link>
  );
};

const ToggleButton = styled.button<{ bgcolor: boolean }>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  transition-duration: 0.4s;
  color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "rgb(191,90,242,0.8)"};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242,0.1)" : "transparent"};
`;
