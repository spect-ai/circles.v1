import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import React, { memo } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import useProjectOnboarding from "@/app/services/Onboarding/useProjectOnboarding";

import { motion } from "framer-motion";
import { fadeVariant } from "../../Card/Utils/variants";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import Onboarding from "../ProjectOnboarding";
import { filterCards } from "./filterCards";
import { Filter } from "@/app/types";
import Board from "./Board";

function View() {
  const { localProject: project } = useLocalProject();
  const { canDo } = useRoleGate();
  const { onboarded } = useProjectOnboarding();

  const router = useRouter();
  const { view: vId } = router.query;

  if (!vId || !project) {
    return null;
  }

  const viewId : string = project.viewOrder?.[Number(vId[vId.length - 1])]!;
  const view = project.viewDetails?.[viewId as string];  
  

  return (
    <>
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
          {view?.type == 'Board' && <Board viewId={viewId} key={viewId}/>}
        </Box>
      </motion.main>
    </>
  );
}

export default memo(View);
