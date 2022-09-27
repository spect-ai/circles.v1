import React, { useEffect } from "react";
import { Box, Text } from "degen";
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

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
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
    data: user,
    refetch: fetchUser,
    isLoading,
  } = useQuery<UserType>(
    ["user", username],
    async () =>
      await fetch(`${process.env.API_HOST}/user/username/${username}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  if (!connectedUser) setIsSidebarExpanded(true);

  useEffect(() => {
    if (username) {
      void fetchUser();
    }
    setIsSidebarExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, username, fetchUser]);

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <PublicLayout>
        {isLoading && <Loader loading text="fetching" />}
        {!user?.id && (
          <Box
            style={{
              width: "90vw",
              height: "90vh",
              margin: "25% auto",
              alignItems: "center",
            }}
          >
            <Text variant="extraLarge" size="headingOne" align="center">
              Fren not found :(
            </Text>
          </Box>
        )}
        {user?.id && !isLoading && (
          <Box display="flex" flexDirection="row" width="full">
            <ProfileCard username={username as string} />
            <ProfileTabs username={username as string} />
          </Box>
        )}
      </PublicLayout>
      {isProfilePanelExpanded && <TaskWallet tab={tab} />}
    </>
  );
};

export default ProfilePage;
