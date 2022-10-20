import React, { memo, ReactElement, useEffect } from "react";
import { Box } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import ExploreSidebar from "./ExploreSidebar";
import CircleSidebar from "./CircleSidebar";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";
import { useGlobal } from "@/app/context/globalContext";
import ProfileButton from "../Sidebar/ProfileButton";
import { Connect } from "../Sidebar/ProfileButton/ConnectButton";

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

function ExtendedSidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { connectUser, connectedUser } = useGlobal();
  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!connectedUser && currentUser?.id) connectUser(currentUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;
        if (data?.id) connectUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {!connectedUser && cId && <Connect />}
      </Box>
    </motion.div>
  );
}

export default memo(ExtendedSidebar);
