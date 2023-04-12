import { memo, ReactElement } from "react";
import { Box } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import ExploreSidebar from "./ExploreSidebar";
import CircleSidebar from "./CircleSidebar";
import ProfileButton from "../Sidebar/ProfileButton";
import { Connect } from "../Sidebar/ProfileButton/ConnectButton";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";

const slide = {
  hidden: {
    width: "0rem",
    minWidth: "0rem",
    opacity: 0,
  },
  visible: {
    width: "20rem",
    minWidth: "20rem",
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    width: "0rem",
    minWidth: "0rem",
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};

function ExtendedSidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId } = router.query;
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  return (
    <motion.div
      key="content"
      variants={slide}
      initial="hidden"
      animate="visible"
      exit="exit"
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
