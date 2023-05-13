import React, { memo, useEffect } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
import styled from "styled-components";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { connectedUserAtom, isSidebarExpandedAtom } from "@/app/state/global";
import { useAccount, useConnect } from "wagmi";
import { io } from "socket.io-client";
import { socketAtom } from "@/app/state/socket";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const Container = styled(Box)`
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
  return await res.json();
};

function PublicLayout(props: PublicLayoutProps) {
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
          const data = res.data;
          if (data?.id) {
            setConnectedUser(data.id);
            console.log("CONNECT USER");
          }
        })
        .catch((err) => {
          console.log(err);
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

  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    if (!address && connectedUser) {
      const connectorId = localStorage.getItem("connectorId");
      console.log({ connectorId, connectors });
      connect({ connector: connectors.find((c) => c.id === connectorId) });
    }
  }, [address, connectedUser]);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const H = await (await import("highlight.run")).H;
        process.env.NODE_ENV === "production" &&
          H.identify(currentUser.username || "", {
            id: currentUser.id,
            email: currentUser.email,
            discord: currentUser.discordId || "",
            ethAddress: currentUser.ethAddress || "",
          });
      })();
    }
  }, [currentUser]);

  return (
    <DesktopContainer backgroundColor="backgroundSecondary" id="public-layout">
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container>{children}</Container>
      </Box>
    </DesktopContainer>
  );
}

export default memo(PublicLayout);
