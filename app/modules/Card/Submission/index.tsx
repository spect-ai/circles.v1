import React from "react";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import WorkThread from "./WorkThread";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Text } from "degen";
import { fadeVariant } from "../Utils/variants";
import CreateSubmission from "./CreateSubmission";

export default function Submission() {
  const { workThreadOrder, workThreads } = useLocalCard();
  const { canTakeAction } = useRoleGate();

  return (
    <motion.main
      variants={fadeVariant}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
      className=""
    >
      {canTakeAction("cardSubmission") && (
        <CreateSubmission workThreadOrder={workThreadOrder} />
      )}
      {workThreadOrder.map((workThreadId) => (
        <WorkThread key={workThreadId} workThread={workThreads[workThreadId]} />
      ))}
      {workThreadOrder.length === 0 && (
        <Box marginLeft="2">
          <Text variant="large" weight="semiBold">
            No Submissions yet
          </Text>
        </Box>
      )}
    </motion.main>
  );
}
