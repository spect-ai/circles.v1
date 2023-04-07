import React, { memo, useEffect } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
import styled from "styled-components";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import {
  connectedUserAtom,
  isSidebarExpandedAtom,
  socketAtom,
} from "@/app/state/global";
import { io } from "socket.io-client";
import { useAccount, useConnect } from "wagmi";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const Container = styled(Box)<{ issidebarexpanded: boolean }>`
  max-width: 100vw;
  flex-grow: 1;
`;

// show this only desktop screens
const DesktopContainer = styled(Box)`
  display: flex;
  flexdirection: row;
  height: 100vh;
  overflowy: auto;
  overflowx: hidden;
`;

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return res.json();
};

const PublicLayout = (props: PublicLayoutProps) => {
  const { children } = props;
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const [isSidebarExpanded, setIsSidebarExpanded] = useAtom(
    isSidebarExpandedAtom
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setMode } = useTheme();

  const { refetch } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

  useEffect(() => {
    if (!connectedUser) {
      refetch()
        .then((res) => {
          const { data } = res;
          if (data?.id) {
            setConnectedUser(data.id);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Could not fetch user data");
        });
    }
  }, []);

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
    isSidebarExpanded && setIsSidebarExpanded(false);
  }, [setIsSidebarExpanded]);

  useEffect(() => {
    const socket2 = io(process.env.API_HOST || "");
    socket2.on("connect", () => {
      setSocket(socket);
    });

    socket2.on("disconnect", () => {
      console.warn("Disconnected");
    });

    return () => {
      socket2.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket?.connected && connectedUser) {
      socket.emit("join", connectedUser);
    }
  }, [connectedUser, socket]);

  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  useEffect(() => {
    if (!address && connectedUser) {
      const connectorId = localStorage.getItem("connectorId");
      connect({ connector: connectors.find((c) => c.id === connectorId) });
    }
  }, [address, connectedUser]);

  return (
    <DesktopContainer backgroundColor="backgroundSecondary" id="public-layout">
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container issidebarexpanded={isSidebarExpanded}>{children}</Container>
      </Box>
    </DesktopContainer>
  );
};

export default memo(PublicLayout);
