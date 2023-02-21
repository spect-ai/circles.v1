import Avatar from "@/app/common/components/Avatar";
import { cancelPayments } from "@/app/services/Paymentv2";
import { MemberDetails, PaymentDetails } from "@/app/types";
import { Box, useTheme, Text, Stack, IconClose, Button, Tag } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
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
  const { circle: cId, status, tab, paymentId } = router.query;
  const { registry } = useCircle();
  const { loading } = usePaymentViewCommon();

  if (loading) return <Box></Box>;
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
            status,
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
          gap="2"
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
                  alignItems="flex-start"
                  gap="2"
                >
                  <Box paddingTop="1">
                    <Text variant="label" weight="semiBold">
                      Total Amount:{" "}
                    </Text>
                  </Box>
                  <Text variant="small">
                    <Text>
                      {paymentDetails.value} {paymentDetails.token?.label} on{" "}
                      {paymentDetails.chain?.label}
                    </Text>
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          {paymentDetails?.labels?.length && (
            <Box
              display="flex"
              flexDirection="row"
              width="1/3"
              gap="2"
              flexWrap="wrap"
            >
              {paymentDetails.labels.map((label, index) => (
                <Tag key={index} tone="accent" size="small">
                  {label.label}
                </Tag>
              ))}
            </Box>
          )}
          <Box
            display="flex"
            flexDirection="column"
            gap="2"
            width="3/4"
            paddingTop="2"
          >
            <Text variant="label" weight="semiBold">
              Payee{" "}
            </Text>
            <Payee value={paymentDetails} mode="view" />
          </Box>
        </Box>
      </Box>
      {cId && router.query?.status === "completed" && (
        <a
          href={`${registry?.[paymentDetails.chain?.value]?.blockExplorer}tx/${
            paymentDetails.transactionHash
          }`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Box
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
