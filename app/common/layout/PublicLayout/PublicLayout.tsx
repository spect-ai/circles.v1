import React, { memo, useEffect } from "react";

import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import ExtendedSidebar from "../../../modules/ExtendedSidebar/ExtendedSidebar";
import Sidebar from "@/app/modules/Sidebar";
import styled from "styled-components";
import { useGlobal } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { toast } from "react-toastify";
import ConnectPage from "../../../modules/Dashboard/ConnectPage";
import Onboard from "../../../modules/Dashboard/Onboard";

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
  display: flex;
  flexdirection: row;
  height: 100vh;
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
  const { isSidebarExpanded, connectedUser, connectUser } = useGlobal();
  const { mode } = useTheme();

  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );

  const { data: myCircles, refetch: refetchCircles } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const onboard =
    myCircles?.length == 0 ||
    (myCircles?.[0]?.projects &&
      Object.values(myCircles?.[0]?.projects)?.length == 0) &&
    (myCircles?.[0]?.collections &&
      Object.values(myCircles?.[0]?.collections)?.length == 0);

  console.log((myCircles?.[0]?.projects &&
    Object.values(myCircles?.[0]?.projects)?.length == 0) &&
  (myCircles?.[0]?.collections &&
    Object.values(myCircles?.[0]?.collections)?.length == 0));
  useEffect(() => {
    if (!connectedUser && currentUser?.id) connectUser(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    void refetchCircles();
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

  return (
    <DesktopContainer
      backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
      id="public-layout"
    >
      {connectedUser && currentUser?.id && onboard && <Onboard />}
      {!connectedUser && !currentUser?.id && <ConnectPage />}
      {connectedUser && currentUser?.id && !onboard && (
        <>
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
        </>
      )}
    </DesktopContainer>
  );
}

export default memo(PublicLayout);
