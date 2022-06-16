import React, { useState } from "react";

import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import ExtendedSidebar from "./ExtendedSidebar/ExtendedSidebar";
import Header from "../Header";
import Sidebar from "@/app/modules/Sidebar";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/app/context/globalContext";
import styled from "styled-components";

type PublicLayoutProps = {
  children: ReactNodeNoStrings;
};

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

const Container = styled(Box)<{ isSidebarExpanded: boolean }>`
  max-width: ${(props) =>
    props.isSidebarExpanded ? "calc(100vw - 23rem)" : "calc(100vw - 2rem)"};
  flex-grow: 1;
`;

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  const { isSidebarExpanded } = useGlobalContext();

  const router = useRouter();
  const { circle: cId } = router.query;

  // const { dispatch } = useGlobal();
  // const { isInitialized, Moralis } = useMoralis();

  // useEffect(() => {
  //   if (isInitialized) {
  //     initContracts(dispatch);
  //     initRegistry(dispatch, Moralis);
  //   }
  // }, [isInitialized]);
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
    >
      <Sidebar />

      <AnimatePresence initial={false}>
        {isSidebarExpanded && cId && <ExtendedSidebar />}
      </AnimatePresence>
      <Box display="flex" flexDirection="column" width="full">
        <Header />
        <motion.main
          variants={variants} // Pass the variant object into Framer Motion
          initial="hidden" // Set the initial state to variants.hidden
          animate="enter" // Animated state to variants.enter
          exit="exit" // Exit state (used later) to variants.exit
          transition={{ type: "linear" }} // Set the transition to linear
          className=""
        >
          <Container
            isSidebarExpanded={isSidebarExpanded}
            transitionDuration="1000"
          >
            {children}
          </Container>
        </motion.main>
      </Box>
    </Box>
  );
}

export default PublicLayout;
