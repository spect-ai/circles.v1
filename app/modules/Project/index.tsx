import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import React, { memo } from "react";
import { useLocalProject } from "./Context/LocalProjectContext";
import useProjectOnboarding from "@/app/services/Onboarding/useProjectOnboarding";
import { motion } from "framer-motion";
import { fadeVariant } from "../Card/Utils/variants";
import { useRouter } from "next/router";
import BoardView from "./BoardView";
import { ToastContainer } from "react-toastify";
import Onboarding from "./ProjectOnboarding";
import ListView from "./ListView";

function Project() {
  const { view } = useLocalProject();
  const { canDo } = useRoleGate();
  const { onboarded } = useProjectOnboarding();

  const router = useRouter();
  const { card: tId } = router.query;

  if (tId) {
    return null;
  }

  return (
    <motion.main
      variants={fadeVariant}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
    >
      <Box width="full">
        <ToastContainer
          toastStyle={{
            backgroundColor: "rgb(20,20,20)",
            color: "rgb(255,255,255,0.7)",
          }}
        />
        {!onboarded && canDo(["steward"]) && <Onboarding />}
        {view === 0 && <BoardView />}
        {view === 1 && <ListView />}
      </Box>
    </motion.main>
  );
}

export default memo(Project);
