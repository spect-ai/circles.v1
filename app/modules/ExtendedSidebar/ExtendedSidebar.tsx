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

function ExtendedSidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { connectedUser } = useGlobal();


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
