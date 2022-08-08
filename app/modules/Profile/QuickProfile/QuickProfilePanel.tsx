import { motion } from "framer-motion";
import { useGlobal } from "@/app/context/globalContext";
import { Box, Avatar, Tag, Text, Button } from "degen";
import QuickProfileTabs from "./QuickProfileTab";
import { useTheme } from "degen";
import queryClient from "@/app/common/utils/queryClient";
import { useEffect } from "react";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useDisconnect } from "wagmi";
import { useQuery } from "react-query";

const QuickProfilePanel = () => {
  const {
    isProfilePanelExpanded,
    setIsProfilePanelExpanded,
    quickProfileUser,
    disconnectUser,
  } = useGlobal();
  const { mode } = useTheme();
  const { disconnect } = useDisconnect();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { data: userData, refetch: fetchUser } = useQuery<UserType>(
    ["user", quickProfileUser],
    async () =>
      await fetch(`${process.env.API_HOST}/user/${quickProfileUser}`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void fetchUser();
  }, [userData, quickProfileUser, fetchUser]);

  return (
    <motion.div
      onClick={() => {
        setIsProfilePanelExpanded(!isProfilePanelExpanded);
      }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        alignItems: "flex-end",
        zIndex: 1,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "700px" }}
        animate={{ x: "0px" }}
        transition={{ duration: 0.5 }}
        exit={{ x: "700px" }}
      >
        <Box
          backgroundColor={mode === "dark" ? "background" : "white"}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            padding: "2rem",
            width: "700px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            zIndex: 2,
            boxShadow: `-1rem 2rem 1rem ${
              mode === "dark" ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.05)"
            }`,
          }}
        >
          <Box
            paddingBottom="4"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              position: "relative",
              alignItems: "center",
              width: "650px",
              borderBottom: "1px solid rgba(255, 255, 255, .1)",
            }}
          >
            <Avatar
              label="profile-pic"
              src={userData?.avatar}
              size="16"
              address={userData?.ethAddress}
            />
            <Box style={{ gap: "1.5rem" }}>
              <Text variant="extraLarge" weight="semiBold">
                {userData?.username}
              </Text>
              <Tag tone="purple" size="small">
                {userData?.ethAddress.substring(0, 20) + "..."}
              </Tag>
            </Box>
            <Box
              style={{ position: "absolute", right: "1rem" }}
              display="flex"
              flexDirection="row"
              gap="1.5"
            >
              <Link href={`/profile/${userData?.id}`}>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setIsProfilePanelExpanded(false);
                  }}
                >
                  View Profile
                </Button>
              </Link>
              {currentUser?.id == userData?.id && (
                <Button
                  size="small"
                  variant="tertiary"
                  onClick={async () => {
                    setIsProfilePanelExpanded(false);
                    await fetch(`${process.env.API_HOST}/auth/disconnect`, {
                      method: "POST",
                      credentials: "include",
                    });
                    disconnect();
                    queryClient.setQueryData("getMyUser", null);
                    void queryClient.invalidateQueries("getMyUser");
                    localStorage.removeItem("connectorIndex");
                    disconnectUser();
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Box>
          <QuickProfileTabs userData={userData as UserType} />
        </Box>
      </motion.div>
    </motion.div>
  );
};

export default QuickProfilePanel;
