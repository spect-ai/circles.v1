import React from "react";
import { variants } from "..";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import WorkThread from "./WorkThread";
import SubmissionModal from "./SubmissionModal";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Text } from "degen";

export default function Submission() {
  const { workThreadOrder, workThreads } = useLocalCard();
  const { canTakeAction } = useRoleGate();

  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
      className=""
    >
      {canTakeAction("cardSubmission") && <SubmissionModal />}
      {workThreadOrder.map((workThreadId) => (
        <WorkThread key={workThreadId} workThread={workThreads[workThreadId]} />
      ))}
      {workThreadOrder.length === 0 && (
        <Text variant="large" weight="semiBold">
          No Submissions yet
        </Text>
      )}
    </motion.main>
  );
}
