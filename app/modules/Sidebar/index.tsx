import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Avatar, Box, Button, Stack, Text, IconMenu } from "degen";
import { useRouter } from "next/router";
import CreateCircle from "./CreateCircleModal";
import Logo from "@/app/common/components/Logo";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import CollapseButton from "../ExtendedSidebar/CollapseButton";
import styled from "styled-components";
import TaskWallet from "@/app/modules/Profile/TaskWallet";
import { Visible } from "react-grid-system";
import mixpanel from "@/app/common/utils/mixpanel";

export const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 15rem);
  overflow-y: auto;
`;

function Sidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const {
    connectedUser,
    isSidebarExpanded,
    openQuickProfile,
    setTab,
    isProfilePanelExpanded,
    tab,
    setIsSidebarExpanded,
  } = useGlobal();
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const {
    data: myCircles,
    isLoading: myCirclesLoading,
    refetch,
  } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void refetch();
  }, [refetch, connectedUser]);

  return (
    <>
      <Box
        backgroundColor="background"
        display="flex"
        flexDirection="column"
        borderRightWidth="0.375"
        paddingX={{
          xs: "1",
          md: "2",
        }}
        onMouseEnter={() => {
          !isSidebarExpanded && setShowCollapseButton(true);
        }}
        onMouseLeave={() => {
          setShowCollapseButton(false);
        }}
        transitionDuration="500"
      >
        <Box borderBottomWidth="0.375" paddingY="3">
          {cId && circle ? (
            <Logo
              href={`/${circle?.slug}`}
              src={circle.avatar}
              gradient={circle.gradient}
            />
          ) : (
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
              gradient=""
            />
          )}
        </Box>
        <Box borderBottomWidth="0.375" paddingY="3">
          <Stack space="2">
            <Button
              shape="circle"
              variant={isSidebarExpanded ? "secondary" : "transparent"}
              size="small"
              onClick={() => {
                setIsSidebarExpanded(!isSidebarExpanded);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Expand Sidebar Button", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              <Text color="accent">
                <IconMenu size="5" />
              </Text>
            </Button>
            <Link href="/" passHref>
              <Button
                shape="circle"
                variant="transparent"
                size="small"
                onClick={() => {
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Home Button", {
                      user: currentUser?.username,
                      url: window.location.href,
                    });
                }}
              >
                <Text color="accent">
                  <HomeOutlined style={{ fontSize: "1.3rem" }} />
                </Text>
              </Button>
            </Link>

            {/* {connectedUser && <CreateCircle size="large" />} */}
          </Stack>
        </Box>
        {/* <CollapseButton
          show={showCollapseButton}
          setShowCollapseButton={setShowCollapseButton}
          top="2.8rem"
          left="2.5rem"
        /> */}
        {!isLoading && (
          <ScrollContainer borderBottomWidth={connectedUser ? "0.375" : "0"}>
            {!myCirclesLoading &&
              connectedUser &&
              myCircles?.map &&
              myCircles?.map((aCircle) => (
                <Box paddingY="2" key={aCircle.id}>
                  <Logo
                    key={aCircle.id}
                    href={`/${aCircle.slug}`}
                    src={aCircle.avatar}
                    gradient={aCircle.gradient}
                  />
                </Box>
              ))}
          </ScrollContainer>
        )}
        <Box paddingY="3">
          {currentUser?.id && (
            <Button
              size="small"
              shape="circle"
              variant="transparent"
              onClick={() => {
                setTab("Work");
                openQuickProfile(currentUser.id);
              }}
            >
              <Avatar
                src={currentUser?.avatar}
                address={currentUser.ethAddress}
                label=""
                size={{
                  xs: "8",
                  md: "10",
                }}
              />
            </Button>
          )}
        </Box>
      </Box>
      <AnimatePresence>
        {isProfilePanelExpanded && <TaskWallet tab={tab} />}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
