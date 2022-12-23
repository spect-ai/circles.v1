import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import { useState } from "react";
import { useCircle } from "../CircleContext";
import PaymentCard from "./PaymentCard";

export default function CompletedPayments() {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const { circle, setCircleData } = useCircle();

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
              onClick={() => setIsCardDrawerOpen(true)}
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
