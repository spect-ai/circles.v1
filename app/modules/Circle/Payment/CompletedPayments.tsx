import PrimaryButton from "@/app/common/components/PrimaryButton";
import { exportToCsv } from "@/app/services/CsvExport";
import { MemberDetails } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../CircleContext";
import PaymentCard from "./PaymentCard";

export default function CompletedPayments() {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const { circle, setCircleData } = useCircle();
  const router = useRouter();

  const { circle: cId } = router.query;

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  return (
    <Stack>
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
                  const paidTo = paymentDetails.paidTo.map((paidTo) => {
                    if (paidTo.propertyType === "user")
                      return {
                        username:
                          memberDetails?.memberDetails[paidTo.value as string]
                            .username,
                        ethAddress:
                          memberDetails?.memberDetails[paidTo.value as string]
                            .ethAddress,
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
      {circle.completedPayments?.map((paymentId, index) => {
        return (
          <PaymentCard
            key={index}
            index={index}
            paymentDetails={circle.paymentDetails[paymentId]}
            handleClick={() => {
              setSelectedPaymentId(paymentId);
              setIsCardDrawerOpen(true);
            }}
          />
        );
      })}
    </Stack>
  );
}
