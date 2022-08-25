import React, { memo, ReactElement, useEffect } from "react";
import { Box } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import ExploreSidebar from "./ExploreSidebar";
import CircleSidebar from "./CircleSidebar";
import ConnectModal from "../Sidebar/ProfileButton/ConnectModal";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";
import { useGlobal } from "@/app/context/globalContext";
import ProfileButton from "../Sidebar/ProfileButton";

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

function ExtendedSidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { connectedUser, connectUser } = useGlobal();
  const { refetch } = useQuery<UserType>("getMyUser", getUser, {
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
  }, []);

  return (
    <motion.div
      key="content"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { width: "300px", opacity: 1, minWidth: "300px" },
        collapsed: { width: 0, opacity: 0, minWidth: "0px" },
      }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        borderRightWidth="0.375"
        height="full"
      >
        {!cId && <ExploreSidebar />}
        {cId && <CircleSidebar />}
        {connectedUser && <ProfileButton />}
        {!connectedUser && cId && <ConnectModal />}
      </Box>
    </motion.div>
  );
}

export default memo(ExtendedSidebar);
