import { useEffect, useState } from "react";
import { Box, Stack, Text, useTheme } from "degen";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import type { NextPage } from "next";
import ProfileCard from "@/app/modules/Profile/ProfilePage/ProfileCard";
import ProfileTabs from "@/app/modules/Profile/ProfilePage/Tabs";
import { useRouter } from "next/router";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import FAQModal from "@/app/modules/Dashboard/FAQModal";
import Help from "@/app/common/components/Help";
import { useAtom } from "jotai";
import {
  connectedUserAtom,
  isSidebarExpandedAtom,
  userDataAtom,
} from "@/app/state/global";
import { ToastContainer } from "react-toastify";

const ScrollContainer = styled(Box)<{ mode: string }>`
  ::-webkit-scrollbar {
    height: 0.5rem;
  }
  ::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.3)" : "rgb(0, 0, 0, 0.2)"};
  }
  overflow-y: auto;
`;

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState(false);
  const username = router.query.user;
  const [connectedUser] = useAtom(connectedUserAtom);
  const [, setIsSidebarExpanded] = useAtom(isSidebarExpandedAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const { mode } = useTheme();

  const {
    data: profile,
    refetch: fetchProfile,
    isLoading: isProfileLoading,
  } = useQuery<UserType>(
    ["user", username],
    async () =>
      fetch(`${process.env.API_HOST}/user/v1/username/${username}/profile`, {
        credentials: "include",
      }).then((res) =>
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
      fetchProfile();
    }
    setIsSidebarExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, username, fetchProfile]);

  return (
    <>
      <MetaHead
        title="Spect Profile"
        description="Check out my profile on Spect"
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
            <ToastContainer
              toastStyle={{
                backgroundColor: `${
                  mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
                }`,
                color: `${
                  mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
                }`,
              }}
            />

            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
            >
              <ProfileCard />
              <ProfileTabs />
            </Stack>
          </ScrollContainer>
        )}
        <Help setFaqOpen={setFaqOpen} />
        <AnimatePresence>
          {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
        </AnimatePresence>
      </PublicLayout>
    </>
  );
};

export default ProfilePage;
