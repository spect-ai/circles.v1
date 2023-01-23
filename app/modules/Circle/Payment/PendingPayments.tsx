import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { getNonce } from "@/app/services/Gnosis";
import {
  approveUsingEOA,
  approveUsingGnosis,
  filterTokensByAllowanceOrBalance,
  findAggregatedAmountForEachToken,
  findAndUpdatePaymentIds,
  findPendingPaymentsByNetwork,
  flattenAmountByEachUniqueTokenAndUser,
  getUniqueNetworks,
  hasAllowance,
  hasBalances,
  payUsingEOA,
  payUsingGnosis,
  switchNetwork,
} from "@/app/services/Paymentv2/utils";
import { MemberDetails, Registry, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getAccount } from "@wagmi/core";
import { Box, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import PaymentCard from "./PaymentCard";
import PaymentCardDrawer from "./PaymentCardDrawer";

export default function PendingPayments() {
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [payUsingGnosisSafe, setPayUsingGnosisSafe] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();
  const { isCardDrawerOpen, setIsCardDrawerOpen, pay } = usePaymentViewCommon();

  const { circle } = useCircle();

  return (
    <Stack>
      {isCardDrawerOpen && (
        <PaymentCardDrawer handleClose={() => setIsCardDrawerOpen(false)} />
      )}{" "}
      {!circle.pendingPayments?.length && (
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
            <Text variant="small">You have no pending payments.</Text>
          </Box>
        </Box>
      )}
      <Box
        style={{
          width: "80%",
        }}
        height="full"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        marginTop="4"
        gap="4"
      >
        {selectedPaymentIds.length > 0 && (
          <Box width="36">
            <PrimaryButton
              variant="tertiary"
              onClick={() => setIsCardDrawerOpen(true)}
            >
              Pay Selected
            </PrimaryButton>
          </Box>
        )}

        {circle.pendingPayments?.length > 0 && (
          <Box width="48">
            <PrimaryButton
              onClick={async () => {
                setIsPayLoading(true);
                const uniqueNetworks = getUniqueNetworks(
                  circle.pendingPayments,
                  circle.paymentDetails
                );
                console.log({ uniqueNetworks });
                for (const chainId of uniqueNetworks) {
                  if (!circle.safeAddresses?.[chainId]?.length)
                    await pay(chainId);
                  else {
                    await pay(chainId, payUsingGnosisSafe);
                  }
                }
                setIsPayLoading(false);
              }}
              loading={isPayLoading}
            >
              Batch Pay
            </PrimaryButton>
            <Tooltip
              title="Gnosis safe will be used to pay on networks which have a connected safe"
              theme={mode}
              position="top"
            >
              {" "}
              <Box
                display="flex"
                flexDirection="row"
                gap="2"
                justifyContent="flex-start"
                alignItems="center"
                marginTop="2"
              >
                <CheckBox
                  isChecked={payUsingGnosisSafe}
                  onClick={() => {
                    setPayUsingGnosisSafe(!payUsingGnosisSafe);
                  }}
                />
                <Text variant="base">Pay Using Gnosis</Text>
              </Box>
            </Tooltip>
          </Box>
        )}
      </Box>
      <ScrollContainer>
        {circle.pendingPayments?.map((paymentId, index) => {
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
