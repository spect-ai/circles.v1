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
import { Box, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import { useCircle } from "../CircleContext";
import PaymentCard from "./PaymentCard";

export default function PendingPayments() {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [payUsingGnosisSafe, setPayUsingGnosisSafe] = useState(false);
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

  if (circle.pendingPayments && circle.pendingPayments?.length === 0)
    return (
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
          <PrimaryButton
            variant="tertiary"
            onClick={() => setIsCardDrawerOpen(true)}
          >
            Add a Pending Payment
          </PrimaryButton>
        </Box>
      </Box>
    );

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
          `You do not have sufficient balance for ${tokensWithInsufficientBalance.join(
            ", "
          )}`
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
      toast.info(
        `Lets distribute the tokens where you have sufficient balance...`
      );

      console.log({ chainId });
      await toast.promise(
        switchNetwork(chainId),
        {
          pending: `Please switch to ${registry?.[chainId].name} network`,
          error: {
            render: ({ data }) => data,
          },
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
        const nonce = await getNonce(safeAddress);
        console.log({ nonce });
        console.log("Approving ...");
        const tokensApproved = await approveUsingGnosis(
          chainId,
          tokensWithInsufficientAllowance.map((token) => token.tokenAddress),
          registry as Registry,
          nonce,
          safeAddress
        );

        console.log("Distributing ...");
        const tokensApprvoedSet = new Set(tokensApproved);
        const tokensDistributed = await payUsingGnosis(
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
        const res = await findAndUpdatePaymentIds(
          circle.id,
          chainId,
          tokensDistributed,
          circle.pendingPayments,
          circle.paymentDetails
        );
        if (res) {
          fetchCircle();
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
        const tokensDistributed = await payUsingEOA(
          chainId,
          amounts,
          tokensWithInsufficientAllowance
            .filter((token) => !tokensApprvoedSet.has(token.tokenAddress))
            .map((token) => token.tokenAddress),
          tokensWithInsufficientBalance.map((token) => token.tokenAddress),
          registry as Registry
        );

        const res = await findAndUpdatePaymentIds(
          circle.id,
          chainId,
          tokensDistributed,
          circle.pendingPayments,
          circle.paymentDetails
        );
        if (res) {
          fetchCircle();
        }
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <Stack>
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

        <Box width="48">
          <PrimaryButton
            onClick={async () => {
              const uniqueNetworks = getUniqueNetworks(
                circle.pendingPayments,
                circle.paymentDetails
              );
              console.log({ uniqueNetworks });
              for (const chainId of uniqueNetworks) {
                if (!circle.safeAddresses[chainId]?.length) await pay(chainId);
                else {
                  await pay(chainId, payUsingGnosisSafe);
                }
              }
            }}
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
      </Box>
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
  );
}
