import React, { useEffect, useState } from "react";
import { Box, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import Sidebar from "@/app/modules/Sidebar";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";
import { useRouter } from "next/router";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import { toast } from "react-toastify";


const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

const ProfilePage: NextPage = () => {

  const router = useRouter(); 
  const userId = router.query.user;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();
  const { isProfilePanelExpanded, connectUser } = useGlobal();

  useEffect(() => {
    setTimeout(() => {
      localStorage.getItem("lightMode") && setMode("light");
    }, 100);
  }, []);

  const { data: user, refetch: fetchUser } = useQuery<UserType>(
    ["user", userId],
    async() =>
      await fetch(`${process.env.API_HOST}/user/${userId}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  const { refetch } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

  useEffect(() => {
    if (!user && userId) {
      void fetchUser();
    }
  }, [user, userId]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;
        if (data) connectUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
  }, []);
  

  return (
    <>
      <MetaHead />
      <Box
        backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
        style={{
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "row",
        }}
        id="profile-layout"
      >
      <Sidebar />
      <Box
        display="flex"
        flexDirection="row"
        width="full"
        overflow="hidden"
      >
        <ProfileCard userId={userId as string} />
        {/* <ProfileTabs userId={userId as string} /> */}
      </Box>
      </Box>
      {isProfilePanelExpanded && <QuickProfilePanel/>} 
    </>
  );
};

export default ProfilePage;
