import React, { useEffect, useState } from "react";
import { Box, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import Sidebar from "@/app/modules/Sidebar";
import ProfileCard from "@/app/modules/Profile/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";
import { useRouter } from "next/router";
import { getUser } from "@/app/services/User";
import { UserType } from "@/app/types";

const ProfilePage: NextPage = () => {

  

  const { isProfilePanelExpanded } = useGlobal();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      localStorage.getItem("lightMode") && setMode("light");
    }, 100);
  }, []);

  const [userData, SetUserData] = useState<UserType>();


  const router = useRouter(); 
  const userId = router.query.user;

  const getuser = async(userId: string) => {
    const res = await getUser(userId);
    SetUserData(res);
    return res;
  }

  console.log({userData});

  useEffect(() => {
    if( userId !== undefined){
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getuser(String(userId));
    }
  }, [userId]);

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
        <ProfileCard userData={userData as UserType} />
        <ProfileTabs userData={userData as UserType} />
      </Box>
      </Box>
      {isProfilePanelExpanded && <QuickProfilePanel/>} 
    </>
  );
};

export default ProfilePage;
