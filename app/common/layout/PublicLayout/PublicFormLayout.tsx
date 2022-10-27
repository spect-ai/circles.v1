import React, { memo, useEffect } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import ExtendedSidebar from "../../../modules/ExtendedSidebar/ExtendedSidebar";
import Sidebar from "@/app/modules/Sidebar";
import styled from "styled-components";
import { useGlobal } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";

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

const MobileContainer = styled(Box)`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flexdirection: row;
    height: 100vh;
  }
  overflowy: auto;
  overflowx: hidden;
`;

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

function PublicLayout(props: PublicLayoutProps) {
  const { children } = props;
  const {
    isSidebarExpanded,
    connectedUser,
    connectUser,
    setIsSidebarExpanded,
  } = useGlobal();
  const { mode } = useTheme();

  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!connectedUser && currentUser?.id) connectUser(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;
        if (data?.id) connectUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsSidebarExpanded(false);
  }, [setIsSidebarExpanded]);

  return (
    <DesktopContainer
      backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
      id="public-layout"
    >
      <MobileContainer>
        <Sidebar />
        <AnimatePresence initial={false}>
          {isSidebarExpanded && <ExtendedSidebar />}
        </AnimatePresence>
      </MobileContainer>
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container issidebarexpanded={isSidebarExpanded}>{children}</Container>
      </Box>
    </DesktopContainer>
  );
}

export default memo(PublicLayout);
