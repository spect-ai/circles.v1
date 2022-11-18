import React, { useEffect } from "react";
import { Box, Stack, Text, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/Tabs";
import TaskWallet from "@/app/modules/Profile/TaskWallet";
import { useGlobal } from "@/app/context/globalContext";
import { useRouter } from "next/router";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import styled from "styled-components";

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return await res.json();
};

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const username = router.query.user;
  const {
    isProfilePanelExpanded,
    connectUser,
    setIsSidebarExpanded,
    connectedUser,
    tab,
  } = useGlobal();

  const { refetch } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

  const { mode } = useTheme();

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;
        console.log("in user page", data);
        if (data?.id) connectUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: profile,
    refetch: fetchProfile,
    isLoading: isProfileLoading,
  } = useQuery<UserType>(
    ["user", username],
    async () =>
      await fetch(
        `${process.env.API_HOST}/user/v1/username/${username}/profile`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  if (!connectedUser) setIsSidebarExpanded(true);

  useEffect(() => {
    if (username) {
      void fetchProfile();
    }
    setIsSidebarExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, username, fetchProfile]);

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <PublicLayout>
        {isProfileLoading && <Loader loading text="fetching" />}
        {!profile?.id && !isProfileLoading && (
          <Box
            style={{
              width: "90vw",
              height: "90vh",
              margin: "25% auto",
              alignItems: "center",
              overflowY: "auto",
            }}
          >
            <Text variant="extraLarge" size="headingOne" align="center">
              Fren not found :(
            </Text>
          </Box>
        )}
        {profile?.id && !isProfileLoading && (
          <ScrollContainer mode={mode}>
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
            >
              <ProfileCard username={username as string} />
              <ProfileTabs username={username as string} />
            </Stack>
          </ScrollContainer>
        )}
      </PublicLayout>
      {isProfilePanelExpanded && <TaskWallet tab={tab} />}
    </>
  );
};

const ScrollContainer = styled(Box)<{ mode: string }>`
  ::-webkit-scrollbar {
    width: 5px;
    height: 2rem;
  }
  ::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.3)" : "rgb(0, 0, 0, 0.2)"};
  }
  max-height: 100vh;
  overflow-y: auto;
`;

export default ProfilePage;
