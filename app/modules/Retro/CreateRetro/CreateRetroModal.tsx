import Modal from "@/app/common/components/Modal";
import { Chain, Token } from "@/app/types";
import { Box } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import RetroBudget from "./RetroBudget";
import RetroDetails, { RetroForm } from "./RetroDetails";
import RetroMembers from "./RetroMembers";

type Props = {
  handleClose: () => void;
  folderId: string | undefined;
};

export default function CreateRetroModal({ handleClose, folderId }: Props) {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<RetroForm | undefined>();
  const [budget, setBudget] = useState<{
    chain: Chain;
    token: Token;
    value: string;
  }>({} as any);

  return (
    <Modal title="Start Retro" handleClose={handleClose} size="large">
      <Box
        padding="8"
        style={{
          height: "35rem",
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {step === 0 && (
            <RetroDetails
              setStep={setStep}
              key="details"
              setDetails={setDetails}
              details={details}
            />
          )}
          {step === 1 && (
            <RetroBudget setStep={setStep} key="budget" setBudget={setBudget} />
          )}
          {step === 2 && (
            <RetroMembers
              handleClose={handleClose}
              setStep={setStep}
              key="members"
              retroDetails={details}
              retroBudget={budget}
              folderId={folderId}
            />
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
}
