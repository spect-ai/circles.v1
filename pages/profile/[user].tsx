import React, { useEffect } from "react";
import { Box } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/ProfileTab";
import QuickProfilePanel from "@/app/modules/Profile/TaskWallet/TaskWalletPanel";
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
  const userId = router.query.user;
  const { isProfilePanelExpanded, connectUser, setIsSidebarExpanded, connectedUser } =
    useGlobal();

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

  if (!connectedUser) setIsSidebarExpanded(true);

  useEffect(() => {
    if (userId) {
      void fetchUser();
    }
    setIsSidebarExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userId, fetchUser]);

  return (
    <>
      <MetaHead />
      <PublicLayout>
        {isLoading ||
          !user?.id ||
          (!userId && <Loader loading text="fetching" />)}
        <Box display="flex" flexDirection="row">
          <ProfileCard userId={userId as string} />
          <ProfileTabs userId={userId as string} />
        </Box>
      </PublicLayout>
      {isProfilePanelExpanded && <QuickProfilePanel tab="Work" />}
    </>
  );
};

export default ProfilePage;
