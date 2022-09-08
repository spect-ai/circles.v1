import React, { memo, useEffect } from "react";

import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import ExtendedSidebar from "../../../modules/ExtendedSidebar/ExtendedSidebar";
import Sidebar from "@/app/modules/Sidebar";
import styled from "styled-components";
import { useConnect } from "wagmi";
import { useGlobal } from "@/app/context/globalContext";

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
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flexdirection: row;
    height: 100vh;
  }
  overflowy: auto;
  overflowx: hidden;
`;

// show this only mobile screens
const MobileContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  @media (min-width: 768px) {
    display: none;
  }
`;

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  const { isSidebarExpanded } = useGlobal();

  const { mode } = useTheme();

  const { connect, connectors, isConnected } = useConnect();

  useEffect(() => {
    if (localStorage.getItem("connectorIndex") && !isConnected) {
      const index = parseInt(localStorage.getItem("connectorIndex") as string);
      connect(connectors[index]);
    }
  }, [connect, connectors, isConnected]);

  return (
    <>
      <DesktopContainer
        backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
        id="public-layout"
      >
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
      </DesktopContainer>
      <MobileContainer
        backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
      >
        <Text variant="label">
          Mobile not supported yet, please use desktop
        </Text>
      </MobileContainer>
    </>
  );
}

export default memo(PublicLayout);
