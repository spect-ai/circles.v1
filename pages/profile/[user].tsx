import Sidebar from "@/app/modules/Sidebar";
import { Box } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import ProfileCard from "@/app/modules/Profile/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";


const ProfilePage: NextPage = () => {

  const { isProfilePanelExpanded } = useGlobal();

  return (
    <>
      <MetaHead />
      <Box
        backgroundColor="background"
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
        backgroundColor="foregroundTertiary"
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
