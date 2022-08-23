import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, Text, useTheme } from "degen";
import React, { memo } from "react";
import { useLocalProject } from "./Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
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
  const { setViewName } = useGlobal();

  const router = useRouter();
  const { card: tId, view: vId } = router.query;

  const { mode } = useTheme();

  if (tId || !project) {
    return null;
  }

  let viewId = "";

  if (vId !== undefined) {
    viewId = vId as string;
    setViewName(viewId);
  } else {
    viewId = "";
    setViewName(viewId);
  }

  const selectedView = project.viewDetails?.[viewId];

  if (project?.unauthorized)
    return (
      <>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This project is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </>
    );

  return (
    <>
      <AnimatePresence>
        {/* {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )} */}
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
              backgroundColor: `${
                mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
              }`,
              color: `${
                mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
              }`,
            }}
          />
          {!onboarded && canDo(["steward"]) && <Onboarding />}
          {!vId && view === 0 && <BoardView viewId={""} />}
          {!vId && view === 1 && <ListView viewId={""} />}
          {vId && selectedView?.type == "Board" && (
            <BoardView viewId={viewId} />
          )}
          {vId && selectedView?.type == "List" && <ListView viewId={viewId} />}
        </Box>
      </motion.main>
    </>
  );
}

export default memo(Project);
