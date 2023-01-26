import { getNonce } from "@/app/services/Gnosis";
import {
  approveUsingEOA,
  approveUsingGnosis,
  filterTokensByAllowanceOrBalance,
  findAggregatedAmountForEachToken,
  findAndUpdatePaymentIds,
  findPendingPaymentsByNetwork,
  flattenAmountByEachUniqueTokenAndUser,
  hasAllowance,
  hasBalances,
  payUsingEOA,
  payUsingGnosis,
  switchNetwork,
} from "@/app/services/Paymentv2/utils";
import {
  MemberDetails,
  Option,
  PaymentDetails,
  Registry,
  UserType,
} from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";

export default function usePaymentViewCommon() {
  const { data: currentUser, refetch } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { circle, fetchCircle, registry } = useCircle();
  const router = useRouter();
  const { circle: cId, paymentId, newCard, status } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const [totalAmount, setTotalAmount] = useState(
    [] as { chain: Option; token: Option; value: number }[]
  );
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [value, setValue] = useState({} as PaymentDetails);
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);

  const pay = async (
    chainId: string,
    gnosisPayment = false,
    paymentIds: string[] | null = null
  ) => {
    try {
      const pendingPayments =
        paymentIds ||
        findPendingPaymentsByNetwork(
          chainId,
          circle.pendingPayments,
          circle.paymentDetails
        );
      console.log({ pendingPayments });
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

  useEffect(() => {
    if (paymentId) {
      setValue(circle.paymentDetails[paymentId as string]);
      setIsCardDrawerOpen(true);
    } else if (newCard) {
      setValue({
        ...value,
        type: "Manually Added",
        chain: {
          value: circle.defaultPayment?.chain?.chainId,
          label: circle.defaultPayment?.chain?.name,
        },
      });
      setIsCardDrawerOpen(true);
    } else {
      setIsCardDrawerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, newCard]);

  const getAggregateValues = () => {
    const aggregatedValue = value.paidTo.reduce((acc, curr) => {
      const index = acc.findIndex(
        (a) => a.token?.value === curr.reward.token?.value
      );
      if (index === -1) {
        acc.push({
          chain: value.chain,
          token: curr.reward.token,
          value: curr.reward.value,
        });
      } else {
        acc[index].value += curr.reward.value;
      }
      return acc;
    }, [] as { chain: Option; token: Option; value: number }[]);
    return aggregatedValue;
  };

  useEffect(() => {
    setLoading(true);
    if (value?.paidTo?.length) {
      setTotalAmount(getAggregateValues());
    } else {
      setTotalAmount([]);
    }
    setLoading(false);
  }, [value?.paidTo]);

  return {
    memberDetails,
    isCardDrawerOpen,
    setIsCardDrawerOpen,
    newCard,
    paymentId,
    status,
    paymentDetails: circle.paymentDetails,
    value,
    setValue,
    pay,
    totalAmount,
    loading,
    setLoading,
  };
}
