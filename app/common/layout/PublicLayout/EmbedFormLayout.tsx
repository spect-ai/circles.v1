import React, { memo, useEffect } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
import styled from "styled-components";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import {
  connectedUserAtom,
  isSidebarExpandedAtom,
  socketAtom,
} from "@/app/state/global";
import { io } from "socket.io-client";

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

const EmbedLayout = (props: PublicLayoutProps) => {
  const { children } = props;
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const [, setIsSidebarExpanded] = useAtom(isSidebarExpandedAtom);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setMode } = useTheme();

  const router = useRouter();
  const { mode } = router.query;

  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!connectedUser && currentUser?.id) setConnectedUser(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const { data } = res;
        if (data?.id) setConnectedUser(currentUser?.id || "");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (mode === "light") {
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
  }, [mode]);

  useEffect(() => {
    setIsSidebarExpanded(false);
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

  return (
    <DesktopContainer backgroundColor="transparent" id="public-layout">
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container issidebarexpanded={false}>{children}</Container>
      </Box>
    </DesktopContainer>
  );
};

export default memo(EmbedLayout);
