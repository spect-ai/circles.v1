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
import PaymentCard from "./PaymentCard";

export default function PendingPayments() {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [payUsingGnosisSafe, setPayUsingGnosisSafe] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const router = useRouter();
  const { mode } = useTheme();

  const { circle, setCircleData, fetchCircle } = useCircle();
  const { circle: cId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const { openConnectModal } = useConnectModal();

  // if (!circle.pendingPayments?.length)
  //   return (
  //     <Box
  //       width="full"
  //       display="flex"
  //       flexDirection="row"
  //       justifyContent="center"
  //       marginTop="48"
  //     >
  //       <Box
  //         width="72"
  //         display="flex"
  //         flexDirection="column"
  //         alignItems="center"
  //         gap="4"
  //       >
  //         <Text variant="small">You have no pending payments.</Text>
  //         <PrimaryButton
  //           variant="tertiary"
  //           onClick={() => setIsCardDrawerOpen(true)}
  //         >
  //           Add a Pending Payment
  //         </PrimaryButton>
  //       </Box>
  //     </Box>
  //   );

  const pay = async (chainId: string, gnosisPayment = false) => {
    try {
      const pendingPayments = findPendingPaymentsByNetwork(
        chainId,
        circle.pendingPayments,
        circle.paymentDetails
      );
      const amounts = flattenAmountByEachUniqueTokenAndUser(
        pendingPayments,
        circle.paymentDetails,
        memberDetails as MemberDetails
      );
      console.log({ amounts });
      if (amounts.length === 0) return;

      const aggregatedAmounts = findAggregatedAmountForEachToken(amounts);
      console.log({ aggregatedAmounts });
      const hasRequiredBalances = await hasBalances(
        chainId,
        gnosisPayment
          ? circle.safeAddresses[chainId][0]
          : (currentUser?.ethAddress as string),
        aggregatedAmounts
      );
      console.log({ hasRequiredBalances });

      const hasRequiredAllowances = await hasAllowance(
        registry as Registry,
        chainId,
        gnosisPayment
          ? circle.safeAddresses[chainId][0]
          : (currentUser?.ethAddress as string),
        aggregatedAmounts
      );
      console.log({ hasRequiredAllowances });

      const tokensWithInsufficientBalance = filterTokensByAllowanceOrBalance(
        chainId,
        hasRequiredBalances,
        registry as Registry,
        false
      );
      console.log({ tokensWithInsufficientBalance });

      if (tokensWithInsufficientBalance.length > 0) {
        toast.error(
          `You do not have sufficient balance for ${tokensWithInsufficientBalance
            ?.map((t) => t.symbol)
            .join(", ")}`
        );
      }

      const tokensWithSufficientBalance = filterTokensByAllowanceOrBalance(
        chainId,
        hasRequiredBalances,
        registry as Registry,
        true
      );
      console.log({ tokensWithSufficientBalance });
      if (tokensWithSufficientBalance.length === 0) return;

      await toast.promise(
        switchNetwork(chainId),
        {
          pending: `Please switch to ${registry?.[chainId].name} network`,
        },
        {
          position: "top-center",
        }
      );

      const tokensWithInsufficientAllowance = filterTokensByAllowanceOrBalance(
        chainId,
        hasRequiredAllowances,
        registry as Registry,
        false
      );

      if (gnosisPayment) {
        console.log("Gnosis payment");
        const safeAddress = circle.safeAddresses[chainId][0];
        const startNonce = await getNonce(safeAddress);
        console.log({ startNonce });
        console.log("Approving ...");
        const { tokensApproved, nonce } = await approveUsingGnosis(
          chainId,
          tokensWithInsufficientAllowance.map((token) => token.tokenAddress),
          registry as Registry,
          startNonce,
          safeAddress
        );

        console.log("Distributing ...");
        const tokensApprvoedSet = new Set(tokensApproved);
        const { tokensDistributed, txHash } = await payUsingGnosis(
          chainId,
          amounts,
          tokensWithInsufficientAllowance
            .filter((token) => !tokensApprvoedSet.has(token.tokenAddress))
            .map((token) => token.tokenAddress),
          tokensWithInsufficientBalance.map((token) => token.tokenAddress),
          registry as Registry,
          nonce,
          safeAddress
        );

        console.log({ tokensDistributed });
        if (tokensDistributed?.length) {
          const res = await findAndUpdatePaymentIds(
            circle.id,
            chainId,
            tokensDistributed,
            circle.pendingPayments,
            circle.paymentDetails,
            txHash
          );
          if (res) {
            fetchCircle();
          }
        }
      } else {
        console.log("EOA payment");
        console.log("Approving ...");
        const tokensApproved = await approveUsingEOA(
          chainId,
          tokensWithInsufficientAllowance.map((token) => token.tokenAddress),
          registry as Registry
        );

        console.log("Distributing ...");
        const tokensApprvoedSet = new Set(tokensApproved);
        const { tokensDistributed, txHash } = await payUsingEOA(
          chainId,
          amounts,
          tokensWithInsufficientAllowance
            .filter((token) => !tokensApprvoedSet.has(token.tokenAddress))
            .map((token) => token.tokenAddress),
          tokensWithInsufficientBalance.map((token) => token.tokenAddress),
          registry as Registry
        );
        if (tokensDistributed?.length) {
          const res = await findAndUpdatePaymentIds(
            circle.id,
            chainId,
            tokensDistributed,
            circle.pendingPayments,
            circle.paymentDetails,
            txHash
          );
          if (res) {
            fetchCircle();
          }
        }
      }
    } catch (e: any) {
      console.log({ e });
      if (e.code === "ACTION_REJECTED")
        toast.error("You rejected requested action");
      else if (e.name === "ConnectorNotFoundError") {
        openConnectModal && openConnectModal();
        toast.error("Please login to your wallet and connect it to Spect");
      } else toast.error("Something went wrong");
    }
  };

  return (
    <Stack>
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
                setSelectedPaymentId(paymentId);
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
