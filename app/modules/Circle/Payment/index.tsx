import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import CardDrawer from "../../CollectionProject/CardDrawer";
import { useCircle } from "../CircleContext";
import PaymentCard from "./PaymentCard";
import PaymentCenterHeading from "./PaymentCenterHeading";

export default function Payment() {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  const { circle } = useCircle();

  return (
    <>
      <PaymentCenterHeading />
      <Container
        marginX="8"
        paddingY="0"
        style={{
          height: "calc(100vh - 7rem)",
          overflowY: "auto",
        }}
      >
        {/* 
<AnimatePresence>
        {isCardDrawerOpen && (
          <CardDrawer
            handleClose={() => setIsCardDrawerOpen(false)}
            defaultValue={{}}
          />
        )}
      </AnimatePresence> */}
        <Stack>
          {circle.pendingPayments?.map((paymentId, index) => {
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
