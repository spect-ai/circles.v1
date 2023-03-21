import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CardDrawer from "../../CollectionProject/CardDrawer";
import { useCircle } from "../CircleContext";
import CancelledPayments from "./CancelledPayments";
import CompletedPayments from "./CompletedPayments";
import PaymentCard from "./PaymentCard";
import PaymentCenterHeading from "./PaymentCenterHeading";
import PendingPayments from "./PendingPayments";
import PendingSignaturePayments from "./PendingSignaturePayments";

export default function Payment() {
  const [paymentViewId, setPaymentViewId] =
    useState<"Pending" | "Pending Signature" | "Completed" | "Cancelled">(
      "Pending"
    );

  const { mode } = useTheme();

  useEffect(() => {}, []);

  return (
    <Box>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />

      <Container marginX="8" paddingY="0" marginTop="2">
        <PaymentCenterHeading
          paymentViewId={paymentViewId}
          setPaymentViewId={setPaymentViewId}
        />
        {paymentViewId === "Pending" && <PendingPayments />}
        {paymentViewId === "Pending Signature" && <PendingSignaturePayments />}
        {paymentViewId === "Completed" && <CompletedPayments />}
        {paymentViewId === "Cancelled" && <CancelledPayments />}
      </Container>
    </Box>
  );
}

const Container = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
        180deg,
        rgba(191, 90, 242, 0.4) 50%,
        rgba(191, 90, 242, 0.1) 100%
        )
        0% 0% / 100% 100% no-repeat padding-box;
    }
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(191, 90, 242, 0.8);
  }

  
`;
