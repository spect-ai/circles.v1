import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import WorkThread from "./WorkThread";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Text } from "degen";
import { fadeVariant } from "../Utils/variants";
import CreateSubmission from "./CreateSubmission";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import LinkGithubPR from "./LinkGithubPR";

export default function Submission() {
  const { workThreadOrder, workThreads, cardId } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && <CreateSubmission cardId={cardId} setIsOpen={setIsOpen} />}
      </AnimatePresence>
      <motion.main
        variants={fadeVariant}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear" }}
        className=""
      >
        <Stack direction="horizontal">
          {canTakeAction("cardSubmission") && (
            <Box width="1/3" marginBottom="2">
              <PrimaryButton
                onClick={() => setIsOpen(true)}
                variant={
                  workThreadOrder.length > 0 ? "transparent" : "secondary"
                }
              >
                {workThreadOrder.length > 0
                  ? "Add Submission"
                  : "Create Submission Thread"}
              </PrimaryButton>
            </Box>
          )}
          {canTakeAction("cardSubmission") && <LinkGithubPR />}
        </Stack>
        {workThreadOrder.map((workThreadId) => (
          <WorkThread
            key={workThreadId}
            workThread={workThreads[workThreadId]}
          />
        ))}
        {workThreadOrder.length === 0 && (
          <Box marginLeft="2">
            <Text variant="large" weight="semiBold">
              No Submissions yet
            </Text>
          </Box>
        )}
      </motion.main>
    </>
  );
}
