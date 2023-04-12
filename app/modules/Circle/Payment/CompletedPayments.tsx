import PrimaryButton from "@/app/common/components/PrimaryButton";
import { exportToCsv } from "@/app/services/CsvExport";
import { MemberDetails } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import PaymentCard from "./PaymentCard";
import PaymentCardDrawer from "./PaymentCardDrawer";

export default function CompletedPayments() {
  const { circle, setCircleData } = useCircle();
  const router = useRouter();
  const { isCardDrawerOpen, setIsCardDrawerOpen } = usePaymentViewCommon();

  const { circle: cId } = router.query;

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  if (!circle) return null;
  return (
    <Stack>
      <Box>
        <AnimatePresence>
          {isCardDrawerOpen && (
            <PaymentCardDrawer handleClose={() => setIsCardDrawerOpen(false)} />
          )}
        </AnimatePresence>
      </Box>
      <Box
        style={{ width: "80%" }}
        height="full"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="flex-end"
        marginTop="4"
        gap="4"
      >
        {circle.completedPayments?.length > 0 && (
          <Box width="36">
            <PrimaryButton
              variant="tertiary"
              onClick={() => {
                const data = [] as any[];
                circle.completedPayments?.forEach((paymentId) => {
                  const paymentDetails = circle.paymentDetails[paymentId];
                  const paidTo = paymentDetails.paidTo?.map((paidTo) => {
                    if (paidTo.propertyType === "user")
                      return {
                        username:
                          memberDetails?.memberDetails[
                            paidTo.value?.value as string
                          ].username,
                        ethAddress:
                          memberDetails?.memberDetails[
                            paidTo.value?.value as string
                          ].ethAddress,
                        reward: paidTo.reward,
                      };
                    else if (paidTo.propertyType === "ethAddress")
                      return {
                        ethAddress: paidTo.value,
                        reward: paidTo.reward,
                      };
                  });

                  data.push({
                    "Payment ID": paymentId,
                    "Total Payment Amount": paymentDetails.value,
                    "Paid on Network": paymentDetails.chain?.label,
                    "Paid with Token": paymentDetails.token?.label,
                    "Paid to": JSON.stringify(paidTo),
                    "Payment Status": "Completed",
                    "Paid on": paymentDetails.paidOn,
                    "Transaction Hash": paymentDetails.transactionHash,
                  });
                });
                exportToCsv(data, `completed-payments-${new Date().getDate()}`);
              }}
            >
              Export to CSV
            </PrimaryButton>
          </Box>
        )}
      </Box>
      {!circle.completedPayments?.length && (
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
            <Text variant="small">You have no completed payments.</Text>
          </Box>
        </Box>
      )}
      <ScrollContainer>
        {circle.completedPayments?.map((paymentId, index) => {
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
