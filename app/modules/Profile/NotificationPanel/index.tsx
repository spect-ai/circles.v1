import Drawer from "@/app/common/components/Drawer";
import { timeSince } from "@/app/common/utils/utils";
import { useGlobal } from "@/app/context/globalContext";
import { getNotifications } from "@/app/services/Notification";
import { Notification } from "@/app/types";
import { Avatar, Box, Heading, Stack, Text } from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import TaskWalletHeader from "../TaskWallet/TaskWalletHeader";

export default function NotificationPanel() {
  const { setIsProfilePanelExpanded } = useGlobal();
  const handleClose = () => setIsProfilePanelExpanded(false);
  const [tab, setTab] = useState(0);
  const [notifications, setnotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getNotifications(15, page);
      console.log({ res });
      setnotifications(res);
    })().catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <ScrollContainer paddingX="8" paddingY="4">
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
          <InfiniteScroll
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            height="calc(100vh - 200px)"
            dataLength={notifications.length}
            next={() => {
              setPage(page + 1);
              (async () => {
                const res = await getNotifications(15, page + 1);
                console.log({ res });
                if (res.length == 0) {
                  setHasMore(false);
                }
                setnotifications([...notifications, ...res]);
              })().catch((err) => console.log(err));
            }}
            hasMore={hasMore}
            loader={<Heading>Loading..</Heading>}
            endMessage={
              <Stack align="center">
                <Text variant="label">Yay! You have seen it all</Text>
              </Stack>
            }
          >
            {notifications?.reverse().map((notif) => (
              <NotificationItem key={notif.timestamp} notif={notif} />
            ))}
          </InfiniteScroll>
        </Stack>
      </ScrollContainer>
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
        <Text variant="label">{timeSince(new Date(notif.timestamp))} ago</Text>
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

const ScrollContainer = styled(Box)`
  overflow-y: scroll;
  height: calc(100vh - 8rem);

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
