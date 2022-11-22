import React, { memo, useEffect } from "react";
import { ReactNodeNoStrings } from "degen/dist/types/types";
import { Box, useTheme } from "degen";
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

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return await res.json();
};

function EmbedLayout(props: PublicLayoutProps) {
  const { children } = props;
  const { connectedUser, connectUser, setIsSidebarExpanded } = useGlobal();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { setMode } = useTheme();

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
    setIsSidebarExpanded(false);
  }, [setIsSidebarExpanded]);

  return (
    <DesktopContainer backgroundColor="transparent" id="public-layout">
      <Box display="flex" flexDirection="column" width="full" overflow="hidden">
        <Container issidebarexpanded={false}>{children}</Container>
      </Box>
    </DesktopContainer>
  );
}

export default memo(EmbedLayout);
