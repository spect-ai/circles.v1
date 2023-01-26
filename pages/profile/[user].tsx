import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Text, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/Tabs";
import { useGlobal } from "@/app/context/globalContext";
import { useRouter } from "next/router";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import styled from "styled-components";
import NotifCard from "@/app/modules/Profile/ProfilePage/Notif";
import NotificationPanel from "@/app/modules/Profile/NotificationPanel";
import { AnimatePresence } from "framer-motion";
import FAQModal from "@/app/modules/Dashboard/FAQModal";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Help from "@/app/common/components/Help";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState(false);
  const username = router.query.user;
  const {
    isProfilePanelExpanded,
    setIsSidebarExpanded,
    connectedUser,
    tab,
    setUserData,
    userData,
  } = useGlobal();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { mode } = useTheme();

  const {
    data: profile,
    refetch: fetchProfile,
    isLoading: isProfileLoading,
  } = useQuery<UserType>(
    ["user", username],
    async () =>
      await fetch(
        `${process.env.API_HOST}/user/v1/username/${username}/profile`,
        {
          credentials: "include",
        }
      ).then((res) =>
        res.json().then((data) => {
          setUserData(data);
          return data;
        })
      ),
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
              <ProfileCard />
              <ProfileTabs />
              {!userData?.email &&
                profile?.username === currentUser?.username && <NotifCard />}
            </Stack>
          </ScrollContainer>
        )}
        <Help setFaqOpen={setFaqOpen} />
        <AnimatePresence>
          {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
        </AnimatePresence>
      </PublicLayout>
      {isProfilePanelExpanded && <NotificationPanel />}
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
