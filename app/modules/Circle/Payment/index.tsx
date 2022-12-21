import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import CardDrawer from "../../CollectionProject/CardDrawer";
import { useCircle } from "../CircleContext";
import CancelledPayments from "./CancelledPayments";
import CompletedPayments from "./CompletedPayments";
import PaymentCard from "./PaymentCard";
import PaymentCenterHeading from "./PaymentCenterHeading";
import PendingPayments from "./PendingPayments";

export default function Payment() {
  const [paymentViewId, setPaymentViewId] =
    useState<"Pending" | "Completed" | "Cancelled">("Pending");

  const { circle } = useCircle();
  console.log({ dets: circle.paymentDetails });
  return (
    <>
      <PaymentCenterHeading
        paymentViewId={paymentViewId}
        setPaymentViewId={setPaymentViewId}
      />
      <Container marginX="8" paddingY="0">
        {/* 
<AnimatePresence>
        {isCardDrawerOpen && (
          <CardDrawer
            handleClose={() => setIsCardDrawerOpen(false)}
            defaultValue={{}}
          />
        )}
      </AnimatePresence> */}
        {paymentViewId === "Pending" && <PendingPayments />}
        {paymentViewId === "Completed" && <CompletedPayments />}
        {paymentViewId === "Cancelled" && <CancelledPayments />}
      </Container>
    </>
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
