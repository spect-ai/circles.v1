import { motion } from "framer-motion";
import { Box, Spinner } from "degen";
import TaskWalletTabs from "./TaskWalletTab/index";
import { useTheme } from "degen";
import { useEffect } from "react";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import TaskWalletHeader from "./TaskWalletHeader/index";
import { useAtom } from "jotai";
import {
  isProfilePanelExpandedAtom,
  quickProfileUserAtom,
} from "@/app/state/global";

const TaskWallet = ({ tab }: { tab: string }) => {
  const [isProfilePanelExpanded, setIsProfilePanelExpanded] = useAtom(
    isProfilePanelExpandedAtom
  );
  const [quickProfileUser, setQuickProfileUser] = useAtom(quickProfileUserAtom);
  const { mode } = useTheme();

  const {
    data: userData,
    refetch: fetchUser,
    isLoading,
  } = useQuery<UserType>(
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
  }, [userData, quickProfileUser, isProfilePanelExpanded, fetchUser]);

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
        zIndex: 2,
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
          {(isLoading || !userData?.id) && (
            <Box margin="auto">
              <Spinner color="accent" size="large" />
            </Box>
          )}
          {!isLoading && (
            <>
              <TaskWalletHeader />
              <TaskWalletTabs userData={userData as UserType} tab={tab} />
            </>
          )}
        </Box>
      </motion.div>
    </motion.div>
  );
};

export default TaskWallet;
