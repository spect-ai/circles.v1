import React, { memo, useEffect, useState } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
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
import {
  socketAtom,
  connectedUserAtom,
  isSidebarExpandedAtom,
  isProfilePanelExpandedAtom,
  userDataAtom,
  profileLoadingAtom,
} from "@/app/state/global";
import { useAtom } from "jotai";
import { useAccount, useConnect } from "wagmi";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const Container = styled(Box)<{ issidebarexpanded: boolean }>`
  max-width: ${(props) =>
    props.issidebarexpanded ? "calc(100vw - 22rem)" : "calc(100vw - 2rem)"};
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
  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useAtom(
    isProfilePanelExpandedAtom
  );
  const [userData, setUserData] = useAtom(userDataAtom);
  const [profileLoading, setProfileLoading] = useAtom(profileLoadingAtom);

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
            <Sidebar />
            <AnimatePresence initial={false}>
              {isSidebarExpanded && <ExtendedSidebar />}
            </AnimatePresence>
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              overflow="hidden"
            >
              <Container issidebarexpanded={isSidebarExpanded}>
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
