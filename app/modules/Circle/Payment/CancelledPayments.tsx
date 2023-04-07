import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import PaymentCard from "./PaymentCard";
import PaymentCardDrawer from "./PaymentCardDrawer";

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

const CompletedPayments = () => {
  const { circle } = useCircle();
  const { isCardDrawerOpen, setIsCardDrawerOpen } = usePaymentViewCommon();

  if (!circle) return null;
  return (
    <Stack>
      <AnimatePresence>
        {isCardDrawerOpen && (
          <PaymentCardDrawer handleClose={() => setIsCardDrawerOpen(false)} />
        )}
      </AnimatePresence>
      <Box marginTop="4">
        {!circle.cancelledPayments?.length && (
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
        <ScrollContainer>
          {circle.cancelledPayments?.map((paymentId, index) => (
            <PaymentCard
              key={paymentId}
              index={index}
              paymentDetails={circle.paymentDetails[paymentId]}
              handleClick={() => {
                setIsCardDrawerOpen(true);
              }}
            />
          ))}
        </ScrollContainer>
      </Box>
    </Stack>
  );
};

export default CompletedPayments;
