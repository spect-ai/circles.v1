import PrimaryButton from "@/app/common/components/PrimaryButton";
import { getUniqueNetworks } from "@/app/services/Paymentv2/utils";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import PaymentCard from "./PaymentCard";
import PaymentCardDrawer from "./PaymentCardDrawer";

export default function PendingPayments() {
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [isGnosisPayLoading, setIsGnosisPayLoading] = useState(false);
  const { mode } = useTheme();
  const { isCardDrawerOpen, setIsCardDrawerOpen, pay } = usePaymentViewCommon();
  const router = useRouter();
  const { circle } = useCircle();

  return (
    <Stack>
      <AnimatePresence>
        {isCardDrawerOpen && (
          <PaymentCardDrawer handleClose={() => setIsCardDrawerOpen(false)} />
        )}{" "}
      </AnimatePresence>
      {!circle.pendingPayments?.length && (
        <Box
          width="full"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          marginTop="48"
        >
          <Box
            width="72"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="4"
          >
            <Text variant="small">You have no pending payments.</Text>
            <PrimaryButton
              variant="tertiary"
              onClick={() => {
                void router.push({
                  pathname: router.pathname,
                  query: {
                    circle: router.query.circle,
                    tab: "payment",
                    status: "pending",
                    newCard: true,
                  },
                });
              }}
            >
              Create a payment
            </PrimaryButton>
          </Box>
        </Box>
      )}
      <Box
        style={{
          width: "80%",
        }}
        height="full"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        marginTop="4"
        gap="4"
      >
        {selectedPaymentIds.length > 0 && (
          <Box width="36">
            <PrimaryButton
              variant="tertiary"
              onClick={() => setIsCardDrawerOpen(true)}
            >
              Pay Selected
            </PrimaryButton>
          </Box>
        )}

        {circle.pendingPayments?.length > 0 && (
          <Box display="flex" flexDirection="row" gap="2">
            {circle?.safeAddresses &&
              Object.entries(circle?.safeAddresses).some(
                ([aChain, aSafes]) => aSafes?.length > 0
              ) && (
                <Tooltip
                  title="Gnosis safe will be used to pay on networks which have a connected safe"
                  theme={mode}
                  position="top"
                >
                  {" "}
                  <PrimaryButton
                    onClick={async () => {
                      setIsGnosisPayLoading(true);
                      const uniqueNetworks = getUniqueNetworks(
                        circle.pendingPayments,
                        circle.paymentDetails
                      );
                      console.log({ uniqueNetworks });
                      for (const chainId of uniqueNetworks) {
                        if (!circle.safeAddresses?.[chainId]?.length)
                          await pay(chainId);
                        else {
                          await pay(chainId, true);
                        }
                      }
                      setIsGnosisPayLoading(false);
                    }}
                    loading={isGnosisPayLoading}
                    disabled={isPayLoading}
                  >
                    Pay All With Gnosis
                  </PrimaryButton>
                </Tooltip>
              )}{" "}
            <PrimaryButton
              onClick={async () => {
                setIsPayLoading(true);
                const uniqueNetworks = getUniqueNetworks(
                  circle.pendingPayments,
                  circle.paymentDetails
                );
                console.log({ uniqueNetworks });
                for (const chainId of uniqueNetworks) {
                  await pay(chainId);
                }
                setIsPayLoading(false);
              }}
              loading={isPayLoading}
              disabled={isGnosisPayLoading}
            >
              Pay All
            </PrimaryButton>
          </Box>
        )}
      </Box>
      <ScrollContainer>
        {circle.pendingPayments?.map((paymentId, index) => {
          return (
            <PaymentCard
              key={index}
              index={index}
              paymentDetails={circle.paymentDetails[paymentId]}
              handleClick={() => {
                setIsCardDrawerOpen(true);
              }}
            />
          );
        })}
      </ScrollContainer>
    </Stack>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 4px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    height: calc(100vh - 12rem);
  }
  height: calc(100vh - 12rem);
`;
