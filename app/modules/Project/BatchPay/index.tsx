import Modal from "@/app/common/components/Modal";
import { BatchPayInfo } from "@/app/types";
import { Box, Button, IconEth, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Tooltip } from "react-tippy";
import ApproveToken from "./ApproveToken";
import CurrencyPayment from "./CurrencyPayment";
import SelectCards from "./SelectCards";
import TokenPayment from "./TokenPayment";

export default function BatchPay() {
  const [isOpen, setIsOpen] = useState(false);
  const [batchPayInfo, setBatchPayInfo] = useState<BatchPayInfo>();

  const [step, setStep] = useState(0);

  return (
    <>
      <Tooltip html={<Text>Batch Pay</Text>}>
        <Button
          size="small"
          variant="transparent"
          shape="circle"
          onClick={(e: any) => {
            setIsOpen(true);
          }}
        >
          <IconEth />
        </Button>
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Batch Payment"
            handleClose={() => setIsOpen(false)}
            height="40rem"
            size="large"
          >
            {step === 0 && (
              <SelectCards
                setIsOpen={setIsOpen}
                setStep={setStep}
                setBatchPayInfo={setBatchPayInfo}
              />
            )}
            {step === 1 && (
              <CurrencyPayment
                setStep={setStep}
                batchPayInfo={batchPayInfo as BatchPayInfo}
              />
            )}
            {step === 2 && (
              <ApproveToken
                setStep={setStep}
                batchPayInfo={batchPayInfo as BatchPayInfo}
              />
            )}
            {step === 3 && (
              <TokenPayment
                setStep={setStep}
                batchPayInfo={batchPayInfo as BatchPayInfo}
                setIsOpen={setIsOpen}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
