import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Avatar, Box, Button, Stack, Text, IconMenu } from "degen";
import { useRouter } from "next/router";
import Logo from "@/app/common/components/Logo";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import styled from "styled-components";
import mixpanel from "@/app/common/utils/mixpanel";
import NotificationPanel from "../Profile/NotificationPanel";
import {
  getUnreadNotifications,
  patchUnreadNotifications,
} from "@/app/services/Notification";
import { toast } from "react-toastify";

export const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 15rem);
  overflow-y: auto;
`;

function Sidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const {
    connectedUser,
    isSidebarExpanded,
    openQuickProfile,
    isProfilePanelExpanded,
    setIsSidebarExpanded,
  } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const {
    data: circles,
    isLoading: myCirclesLoading,
    refetch,
  } = useQuery<CircleType[]>("dashboardCircles", {
    enabled: false,
  });

  const { socket } = useGlobal();

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const myCircles =
    circles?.filter && circles.filter((c) => c.parents?.length === 0);

  useEffect(() => {
    void refetch();
  }, [refetch, connectedUser]);

  useEffect(() => {
    (async () => {
      const res = await getUnreadNotifications();
      console.log({ res });
      typeof res === "number" && setUnreadNotifications(res);
    })().catch((err) => console.log(err));
  }, [isSidebarExpanded]);

  useEffect(() => {
    socket.connected &&
      socket?.on("notification", (data) => {
        console.log({ data });
        setUnreadNotifications(data.unreadNotifications);
      });
  }, [socket]);

  return (
    <>
      <Box
        backgroundColor="background"
        display="flex"
        flexDirection="column"
        borderRightWidth="0.375"
        paddingX={{
          xs: "1",
          md: "2",
        }}
        transitionDuration="500"
      >
        <Box borderBottomWidth="0.375" paddingY="3">
          {cId && circle ? (
            <Logo
              href={`/${circle?.slug}`}
              src={circle.avatar}
              gradient={circle.gradient}
            />
          ) : (
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
              gradient=""
            />
          )}
        </Box>
        <Box borderBottomWidth="0.375" paddingY="3">
          <Stack space="2">
            <Button
              shape="circle"
              variant={isSidebarExpanded ? "secondary" : "transparent"}
              size="small"
              onClick={() => {
                setIsSidebarExpanded(!isSidebarExpanded);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Expand Sidebar Button", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              <Text color="accent">
                <IconMenu size="5" />
              </Text>
            </Button>
            <Link href="/" passHref>
              <Button
                shape="circle"
                variant="transparent"
                size="small"
                onClick={() => {
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Home Button", {
                      user: currentUser?.username,
                      url: window.location.href,
                    });
                }}
              >
                <Text color="accent">
                  <HomeOutlined style={{ fontSize: "1.3rem" }} />
                </Text>
              </Button>
            </Link>
          </Stack>
        </Box>
        {!isLoading && (
          <ScrollContainer borderBottomWidth={connectedUser ? "0.375" : "0"}>
            {!myCirclesLoading &&
              connectedUser &&
              myCircles?.map &&
              myCircles?.map((aCircle) => (
                <Box paddingY="2" key={aCircle.id}>
                  <Logo
                    key={aCircle.id}
                    href={`/${aCircle.slug}`}
                    src={aCircle.avatar}
                    gradient={aCircle.gradient}
                  />
                </Box>
              ))}
          </ScrollContainer>
        )}
        <Box paddingY="3" position="relative">
          {currentUser?.id && (
            <Button
              size="small"
              shape="circle"
              variant="transparent"
              onClick={() => {
                openQuickProfile(currentUser.id);
                (async () => {
                  if (unreadNotifications > 0) {
                    const res = await patchUnreadNotifications();
                    if (typeof res === "boolean" && true) {
                      setUnreadNotifications(0);
                    }
                  }
                })().catch((err) => {
                  console.error(err);
                  toast.error(
                    "Something went wrong while updating unread notifications"
                  );
                });
              }}
            >
              <Avatar
                src={currentUser?.avatar}
                address={currentUser.ethAddress}
                label=""
                size={{
                  xs: "8",
                  md: "10",
                }}
              />
              {unreadNotifications > 0 && (
                <NotifAlert
                  backgroundColor="accent"
                  borderRadius="2xLarge"
                  width="4"
                  height="4"
                >
                  <p>{unreadNotifications}</p>
                </NotifAlert>
              )}
            </Button>
          )}
        </Box>
      </Box>
      <AnimatePresence>
        {isProfilePanelExpanded && <NotificationPanel />}
      </AnimatePresence>
    </>
  );
}

const NotifAlert = styled(Box)`
  position: absolute;
  top: 8px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 0.6rem;
    color: white;
  }

  animation: pulse 2s infinite;
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(191, 90, 242, 0.8);
    }
    90% {
      box-shadow: 0 0 0 10px rgba(191, 90, 242, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(191, 90, 242, 0);
    }
  }
`;

export default Sidebar;
