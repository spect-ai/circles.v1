import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useERC20 from "@/app/services/Payment/useERC20";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { Box, IconEth, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

export default function Payment() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { approve } = useERC20();
  const { chain, token } = useLocalCard();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)} icon={<IconEth />}>
        Pay
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Payment" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              {step === 0 && (
                <Stack align="center">
                  <Text variant="large" weight="semiBold">
                    You need to approve before you proceed
                  </Text>
                  <Box width="1/2">
                    <PrimaryButton
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        await approve(chain.chainId, token.address);
                        setLoading(false);
                        // await batchPay(
                        //   chain.chainId,
                        //   "tokens",
                        //   [getMemberDetails(assignee)?.ethAddress as string],
                        //   [parseFloat(value)],
                        //   [token.address]
                        // );
                      }}
                    >
                      Approve
                    </PrimaryButton>
                  </Box>
                </Stack>
              )}
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
