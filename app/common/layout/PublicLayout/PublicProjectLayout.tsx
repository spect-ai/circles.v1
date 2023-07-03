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

function PublicProjectLayout(props: PublicLayoutProps) {
  const { children } = props;
  const [socket, setSocket] = useAtom(socketAtom);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setMode } = useTheme();

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

  return (
    <DesktopContainer backgroundColor="backgroundSecondary" id="public-layout">
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container>{children}</Container>
      </Box>
    </DesktopContainer>
  );
}

export default memo(PublicProjectLayout);
