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
      <Box marginTop="4">
        {circle.cancelledPayments && circle.cancelledPayments?.length === 0 && (
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
              <Text variant="small">You have no cancelled payments.</Text>
            </Box>
          </Box>
        )}
        {circle.cancelledPayments?.map((paymentId, index) => {
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
      </Box>
    </Stack>
  );
}
