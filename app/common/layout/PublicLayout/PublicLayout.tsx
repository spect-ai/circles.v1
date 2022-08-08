import React, { memo, useEffect } from "react";

import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, ThemeProvider, useTheme } from "degen";
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

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  const { isSidebarExpanded } = useGlobal();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();

  const { connect, connectors, isConnected } = useConnect();

  useEffect(() => {
    if (localStorage.getItem("connectorIndex") && !isConnected) {
      const index = parseInt(localStorage.getItem("connectorIndex") as string);
      connect(connectors[index]);
    }
  }, [connect, connectors, isConnected]);

  

  return (
    <Box
      backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
      id="public-layout"
    >
      <Sidebar />
      <AnimatePresence initial={false}>
        {isSidebarExpanded && <ExtendedSidebar />}
      </AnimatePresence>
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container issidebarexpanded={isSidebarExpanded}>{children}</Container>
      </Box>
    </Box>
  );
}

export default memo(PublicLayout);
