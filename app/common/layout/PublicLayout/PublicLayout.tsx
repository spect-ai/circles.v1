import React, { memo, useEffect, useState } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, Button, IconMenu, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import ExtendedSidebar from "../../../modules/ExtendedSidebar/ExtendedSidebar";
import Sidebar from "@/app/modules/Sidebar";
import styled from "styled-components";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { toast } from "react-toastify";
import ConnectPage from "../../../modules/Dashboard/ConnectPage";
import Onboard from "../../../modules/Dashboard/Onboard";
import Loader from "@/app/common/components/Loader";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { connectedUserAtom, isSidebarExpandedAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { useAccount, useConnect } from "wagmi";
import { H } from "highlight.run";
import { Hidden, Visible } from "react-grid-system";
import mixpanel from "mixpanel-browser";
import Changelog from "../../changelog";
import { socketAtom } from "@/app/state/socket";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const Container = styled(Box)<{ issidebarexpanded: string }>`
  @media (max-width: 992px) {
    max-width: ${(props) =>
      props.issidebarexpanded === "true"
        ? "calc(100vw - 22rem)"
        : "calc(100vw - 0rem)"};
  }

  max-width: ${(props) =>
    props.issidebarexpanded === "true"
      ? "calc(100vw - 22rem)"
      : "calc(100vw - 2rem)"};
  flex-grow: 1;
`;

// show this only desktop screens
const DesktopContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return await res.json();
};

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setMode } = useTheme();
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useAtom(
    isSidebarExpandedAtom
  );

  const [showChangelog, setShowChangelog] = useState(false);

  const {
    data: myCircles,
    refetch: fetchCircles,
    isLoading: loading,
  } = useQuery<CircleType[]>(
    "dashboardCircles",
    () =>
      fetch(`${process.env.API_HOST}/user/v1/circles`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );
  const {
    data: currentUser,
    refetch,
    isLoading,
  } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

  useEffect(() => {
    if (!connectedUser && currentUser?.id) setConnectedUser(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;

        if (data?.id) setConnectedUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  const [changelogData, setChangelogData] =
    useState<{
      Title: string;
      Description: string;
    }>();

  useEffect(() => {
    if (!address && connectedUser) {
      const connectorId = localStorage.getItem("connectorId");
      console.log({ connectorId, connectors });
      connect({ connector: connectors.find((c) => c.id === connectorId) });
    }
  }, [address, connectedUser]);

  const router = useRouter();
  const { inviteCode, circle } = router.query;

  const onboard =
    (currentUser?.skillsV2?.length == 0 || currentUser?.email?.length == 0) &&
    myCircles?.length == 0 &&
    !inviteCode;

  useEffect(() => {
    void fetchCircles();
    // void fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser, circle]);

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("lightMode")) {
        setMode("light");
        document.documentElement.style.setProperty(
          "--dsg-cell-background-color",
          "rgb(255, 255, 255)"
        );
        document.documentElement.style.setProperty(
          "--dsg-border-color",
          "rgb(20,20,20,0.1)"
        );
        document.documentElement.style.setProperty(
          "--dsg-cell-text-color",
          "rgb(20,20,20,0.9)"
        );
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const socket = io(process.env.API_HOST || "");
    socket.on("connect", function () {
      setSocket(socket);
    });

    socket.on("disconnect", function () {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket?.connected && connectedUser) {
      socket.emit("join", connectedUser);
    }
  }, [connectedUser, socket]);

  useEffect(() => {
    if (currentUser) {
      process.env.NODE_ENV === "production" &&
        H.identify(currentUser.username || "", {
          id: currentUser.id,
          email: currentUser.email,
          discord: currentUser.discordId || "",
          ethAddress: currentUser.ethAddress || "",
        });
    }
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.API_HOST}/collection/v1/changelog`
      );
      const data = await res.json();
      if (!data) return;
      setChangelogData(data);
      if (!localStorage.getItem(data.Title)) {
        setShowChangelog(true);
        localStorage.setItem(data.Title, "true");
      }
    })();
  }, [circle]);

  if (isLoading || loading)
    return (
      <DesktopContainer backgroundColor="backgroundSecondary" id="Load screen">
        <Loader loading text="Launching Spect .." />
      </DesktopContainer>
    );

  return (
    <DesktopContainer backgroundColor="backgroundSecondary">
      {connectedUser && currentUser?.id ? (
        !onboard ? (
          <>
            <Hidden xs sm>
              <Sidebar />
            </Hidden>
            <AnimatePresence initial={false}>
              {isSidebarExpanded && <ExtendedSidebar />}
              {showChangelog && changelogData && (
                <Changelog
                  handleClose={() => setShowChangelog(false)}
                  data={changelogData}
                />
              )}
            </AnimatePresence>
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              overflow="hidden"
            >
              <Visible xs sm>
                <Box padding="2" marginBottom="-2">
                  <Button
                    shape="circle"
                    variant={isSidebarExpanded ? "secondary" : "tertiary"}
                    size="extraSmall"
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
                      <IconMenu size="4" />
                    </Text>
                  </Button>
                </Box>
              </Visible>
              <Container issidebarexpanded={isSidebarExpanded.toString()}>
                {children}
              </Container>
            </Box>
          </>
        ) : (
          <Onboard />
        )
      ) : (
        <ConnectPage />
      )}
    </DesktopContainer>
  );
}

export default memo(PublicLayout);
