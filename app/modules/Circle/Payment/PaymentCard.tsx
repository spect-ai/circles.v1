import Avatar from "@/app/common/components/Avatar";
import { cancelPayments } from "@/app/services/Paymentv2";
import { MemberDetails, PaymentDetails } from "@/app/types";
import { Box, useTheme, Text, Stack, IconClose, Button } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import Payee from "./Payee";

type Props = {
  index: number;
  paymentDetails: PaymentDetails;
  handleClick: (index: number) => void;
};

export default function PaymentCard({
  index,
  paymentDetails,
  handleClick,
}: Props) {
  const router = useRouter();
  const { mode } = useTheme();
  const { circle: cId } = router.query;
  const { fetchCircle, circle } = useCircle();
  const { registry } = useCircle();
  const onCancelPayment = async () => {
    console.log("cancel payment");
    const res = await cancelPayments(circle.id as string, {
      paymentIds: [paymentDetails.id],
    });
    if (res) {
      fetchCircle();
    }
  };

  return (
    <Card
      mode={mode}
      key={index}
      onClick={() => {
        void router.push({
          pathname: router.pathname,
          query: {
            circle: router.query.circle,
            tab: "payment",
            status: "pending",
            paymentId: paymentDetails.id,
          },
        });
      }}
      cursor="pointer"
    >
      <Box
        display="flex"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        width="full"
        gap="4"
      >
        <Box
          display="flex"
          flexDirection="column"
          width="full"
          alignItems="flex-start"
          marginBottom={{
            xs: "0",
            md: "2",
          }}
          gap="4"
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            width="full"
            gap="4"
          >
            <Box width="1/2">
              <Text variant="extraLarge" weight="semiBold">
                {paymentDetails.title}
              </Text>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              width="1/2"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <Box display="flex" flexDirection="column" width="full">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="2"
                >
                  <Text variant="label" weight="semiBold">
                    Total Amount:{" "}
                  </Text>
                  <Text variant="small">
                    {" "}
                    {paymentDetails.value} {paymentDetails.token.label} on{" "}
                    {paymentDetails.chain.label}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="2" width="3/4">
            <Text variant="label" weight="semiBold">
              Payee{" "}
            </Text>
            <Payee value={paymentDetails} mode="view" />
          </Box>
        </Box>
      </Box>
      {cId && router.query?.status === "completed" && (
        <a
          href={`${registry?.[paymentDetails.chain.value].blockExplorer}tx/${
            paymentDetails.transactionHash
          }`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Box cursor="pointer">
            <Text variant="small" color="blue">
              View Transaction
            </Text>
          </Box>
        </a>
      )}
    </Card>
  );
}

export const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};

  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
