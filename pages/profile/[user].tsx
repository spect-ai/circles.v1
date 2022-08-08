import React, { useEffect } from "react";
import { Box, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import Sidebar from "@/app/modules/Sidebar";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/QuickProfile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";
import { useRouter } from "next/router";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Loader from "@/app/common/components/Loader";

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
  const { mode } = useTheme();
  const { isProfilePanelExpanded, connectUser } = useGlobal();

  const { refetch, isLoading } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: user, refetch: fetchUser } = useQuery<UserType>(
    ["user", userId],
    async () =>
      await fetch(`${process.env.API_HOST}/user/${userId}`).then((res) =>
        res.json()
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void fetchUser();
  }, [user, userId, fetchUser]);

  if (isLoading || !user?.id || !userId) {
    return <Loader loading text="fetching" />;
  }

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
        <Box display="flex" flexDirection="row" width="full" overflow="hidden">
          <ProfileCard userId={userId as string} />
          <ProfileTabs userId={userId as string} />
        </Box>
      </Box>
      {isProfilePanelExpanded && <QuickProfilePanel />}
    </>
  );
};

export default ProfilePage;
