import React, { memo, useEffect } from "react";

import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import ExtendedSidebar from "../../../modules/ExtendedSidebar/ExtendedSidebar";
import Sidebar from "@/app/modules/Sidebar";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/app/context/globalContext";
import styled from "styled-components";
import { useConnect } from "wagmi";
import { fadeVariant } from "@/app/modules/Card/Utils/variants";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const Container = styled(Box)<{ issidebarexpanded: boolean }>`
  max-width: ${(props) =>
    props.issidebarexpanded ? "calc(100vw - 22rem)" : "calc(100vw - 2rem)"};
  flex-grow: 1;
`;

// const transition = { duration: 0.4, ease: "easeInOut" };

const slideVariants = {
  hidden: { opacity: 0, x: -100, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 200 },
};

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  const { isSidebarExpanded } = useGlobalContext();

  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (localStorage.getItem("connectorIndex")) {
      console.log("connecting");
      const index = parseInt(localStorage.getItem("connectorIndex") as string);
      connect(connectors[index]);
    }
  }, [connect, connectors]);

  return (
    <Box
      backgroundColor="background"
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
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        backgroundColor="foregroundTertiary"
        overflow="hidden"
      >
        {/* <Header /> */}
        <motion.main
          variants={slideVariants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ type: "linear" }}
        >
          <Container
            issidebarexpanded={isSidebarExpanded}
            transitionDuration="1000"
          >
            {children}
          </Container>
        </motion.main>
      </Box>
    </Box>
  );
}

export default memo(PublicLayout);
