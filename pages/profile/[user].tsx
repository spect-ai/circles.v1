import React, { useEffect } from "react";
import { Box } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import Sidebar from "@/app/modules/Sidebar";
import ProfileCard from "@/app/modules/Profile/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";
import { useTheme } from "degen";



const ProfilePage: NextPage = () => {

  const { isProfilePanelExpanded } = useGlobal();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      localStorage.getItem("lightMode") && setMode("light");
    }, 100);
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
        <ProfileCard/>
        <ProfileTabs/>
      </Box>
      </Box>
      {isProfilePanelExpanded && <QuickProfilePanel/>} 
    </>
  );
};

export default ProfilePage;
