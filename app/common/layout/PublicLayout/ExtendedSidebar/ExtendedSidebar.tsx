import Link from "next/link";
import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Heading,
  IconChevronLeft,
  IconDocuments,
  IconUserSolid,
  Stack,
} from "degen";
import { useRouter } from "next/router";
import styled from "styled-components";
import { motion } from "framer-motion";
// import SpaceSidebar from "./SpaceSidebar";
// import TribeSidebar from "./TribeSidebar";
import { useAccount } from "wagmi";

type props = {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
};

export const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 5rem);
  overflow-y: auto;
`;

function ExtendedSidebar({ isExpanded, setIsExpanded }: props): ReactElement {
  // const { space, setIsSidebarExpanded, globalLoading } = useDataContext();
  const { isSuccess } = useAccount();
  const router = useRouter();
  const { id, bid } = router.query;

  return (
    <motion.div
      key="content"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { width: "300px", opacity: 1, minWidth: "300px" },
        collapsed: { width: 0, opacity: 0, minWidth: "0px" },
      }}
      transition={{ duration: 1 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        borderRightWidth="0.375"
        paddingX="3"
        height="full"
      >
        <Box>
          <Box
            borderBottomWidth="0.375"
            paddingY="3"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            {/* <Heading>{bid && space.team[0].name}</Heading> */}
            {/* <Heading>
              {bid && space.team && (
                <Link href={`/tribe/${id}`} passHref>
                  {space.name ? space.name : ''}
                </Link>
              )}
            </Heading> */}
            <Button
              variant="transparent"
              size="small"
              onClick={() => {
                setIsExpanded(false);
                // setIsSidebarExpanded(false);
              }}
            >
              <IconChevronLeft />
            </Button>
          </Box>
          <Container>
            {/* {bid && <SpaceSidebar />} */}
            {/* {id && !bid && <TribeSidebar />} */}
            <Box paddingY="3">
              {/* {id && !bid && <TribeSettingsModal />}
              {bid && <SpaceSettingsModal />} */}
            </Box>
          </Container>
        </Box>
      </Box>
    </motion.div>
  );
}

export default ExtendedSidebar;
