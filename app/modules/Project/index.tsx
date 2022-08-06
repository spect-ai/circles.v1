import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import React, { memo } from "react";
import { useLocalProject } from "./Context/LocalProjectContext";
import useProjectOnboarding from "@/app/services/Onboarding/useProjectOnboarding";
import CreateSubmission from "@/app/modules/Card/Submission/CreateSubmission";

import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../Card/Utils/variants";
import { useRouter } from "next/router";
import BoardView from "./BoardView";
import { ToastContainer } from "react-toastify";
import Onboarding from "./ProjectOnboarding";
import ListView from "./ListView";
import BatchPay from "./BatchPay";
import Apply from "../Card/Apply";

function Project() {
  const {
    view,
    localProject: project,
    batchPayModalOpen,
    selectedCard,
    setBatchPayModalOpen,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
  } = useLocalProject();
  const { canDo } = useRoleGate();
  const { onboarded } = useProjectOnboarding();

  const router = useRouter();
  const { card: tId, view: vId} = router.query;

  if (tId || !project) {
    return null;
  }

  let viewId : string = '';

  if (vId) {
    const array: string[] = project.viewOrder?.filter((i)=> project.viewDetails?.[i].slug == vId)!;
    viewId = array[0];
  }

  return (
    <>
      <AnimatePresence>
        {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )}
        {isApplyModalOpen && selectedCard && (
          <Apply setIsOpen={setIsApplyModalOpen} cardId={selectedCard.id} />
        )}
        {isSubmitModalOpen && selectedCard && (
          <CreateSubmission
            setIsOpen={setIsSubmitModalOpen}
            cardId={selectedCard.id}
          />
        )}
      </AnimatePresence>
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
          {!vId && view === 0 && <BoardView viewId={''} />}
          {!vId && view === 1 && <ListView />}
          {vId && <BoardView viewId={viewId as string} key={viewId} />}
        </Box>
      </motion.main>
    </>
  );
}

export default memo(Project);
