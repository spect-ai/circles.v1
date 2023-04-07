import { getNonce } from "@/app/services/Gnosis";
import {
  approveUsingEOA,
  approveUsingGnosis,
  filterTokensByAllowanceOrBalance,
  findAggregatedAmountForEachToken,
  findAndUpdateCompletedPaymentIds,
  findAndUpdatePaymentIdsPendingSignature,
  findPaymentIdsByTokenAndChain,
  findPendingPaymentsByNetwork,
  flattenAmountByEachUniqueTokenAndUser,
  hasAllowance,
  hasBalances,
  payUsingEOA,
  payUsingGnosis,
  switchNetwork,
} from "@/app/services/Paymentv2/utils";
import { MemberDetails, PaymentDetails, Registry, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { AbiCoder } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";

export default function usePaymentViewCommon() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { circle, registry } = useCircle();
  const router = useRouter();
  const { circle: cId, paymentId, newCard, status } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
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
    if (circle) {
      try {
        const pendingPayments =
          paymentIds ||
          findPendingPaymentsByNetwork(
            chainId,
            circle.pendingPayments,
            circle.paymentDetails
          );
        const amounts = flattenAmountByEachUniqueTokenAndUser(
          pendingPayments,
          circle.paymentDetails,
          memberDetails as MemberDetails
        );
        if (amounts.length === 0) return;

        const aggregatedAmounts = findAggregatedAmountForEachToken(amounts);
        const hasRequiredBalances = await hasBalances(
          chainId,
          gnosisPayment
            ? circle.safeAddresses[chainId][0]
            : (currentUser?.ethAddress as string),
          aggregatedAmounts
        );

        const hasRequiredAllowances = await hasAllowance(
          registry as Registry,
          chainId,
          gnosisPayment
            ? circle.safeAddresses[chainId][0]
            : (currentUser?.ethAddress as string),
          aggregatedAmounts
        );

        const tokensWithInsufficientBalance = filterTokensByAllowanceOrBalance(
          chainId,
          hasRequiredBalances,
          registry as Registry,
          false
        );

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

        const tokensWithInsufficientAllowance =
          filterTokensByAllowanceOrBalance(
            chainId,
            hasRequiredAllowances,
            registry as Registry,
            false
          );
        const tokensWithSufficientAllowance = filterTokensByAllowanceOrBalance(
          chainId,
          hasRequiredAllowances,
          registry as Registry,
          true
        );

        if (gnosisPayment) {
          const safeAddress = circle.safeAddresses[chainId][0];
          const startNonce = await getNonce(safeAddress);
          const { tokensApproved, nonce } = await approveUsingGnosis(
            chainId,
            tokensWithInsufficientAllowance.map((token) => token.tokenAddress),
            registry as Registry,
            startNonce,
            safeAddress
          );

          const tokensApprvoedSet = new Set(tokensApproved);
          const tokenAddressesBeingDistributed = new Set([
            ...tokensWithSufficientAllowance.map((token) => token.tokenAddress),
            ...tokensApproved,
            ...tokensWithSufficientBalance.map((token) => token.tokenAddress),
          ]);

          const paymentIdsBeingDistributed = findPaymentIdsByTokenAndChain(
            chainId,
            Array.from(tokenAddressesBeingDistributed),
            pendingPayments,
            circle.paymentDetails
          );
          const encoder = new AbiCoder();
          const id = { token: "", currency: "" };
          id.token = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id2) => circle.paymentDetails[id2].token.value !== "0x0"
              ),
            ]
          );

          id.currency = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id2) => circle.paymentDetails[id2].token.value === "0x0"
              ),
            ]
          );
          const { tokensDistributed, txHash } = await payUsingGnosis(
            chainId,
            amounts,
            tokensWithInsufficientAllowance
              .filter((token) => !tokensApprvoedSet.has(token.tokenAddress))
              .map((token) => token.tokenAddress),
            tokensWithInsufficientBalance.map((token) => token.tokenAddress),
            registry as Registry,
            nonce,
            safeAddress,
            id
          );

          await findAndUpdatePaymentIdsPendingSignature(
            circle.id,
            chainId,
            tokensDistributed,
            pendingPayments,
            circle.paymentDetails,
            txHash
          );
        } else {
          const tokensApproved = await approveUsingEOA(
            chainId,
            tokensWithInsufficientAllowance.map((token) => token.tokenAddress),
            registry as Registry
          );

          const tokensApprvoedSet = new Set(tokensApproved);
          const tokenAddressesBeingDistributed = new Set([
            ...tokensWithSufficientAllowance.map((token) => token.tokenAddress),
            ...tokensApproved,
            ...tokensWithSufficientBalance.map((token) => token.tokenAddress),
          ]);

          const paymentIdsBeingDistributed = findPaymentIdsByTokenAndChain(
            chainId,
            Array.from(tokenAddressesBeingDistributed),
            pendingPayments,
            circle.paymentDetails
          );
          const encoder = new AbiCoder();
          const id = { token: "", currency: "" };
          id.token = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id2) => circle.paymentDetails[id2].token.value !== "0x0"
              ),
            ]
          );
          id.currency = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id2) => circle.paymentDetails[id2].token.value === "0x0"
              ),
            ]
          );

          const { tokensDistributed, txHash } = await payUsingEOA(
            chainId,
            amounts,
            tokensWithInsufficientAllowance
              .filter((token) => !tokensApprvoedSet.has(token.tokenAddress))
              .map((token) => token.tokenAddress),
            tokensWithInsufficientBalance.map((token) => token.tokenAddress),
            registry as Registry,
            id
          );
          if (tokensDistributed?.length) {
            await findAndUpdateCompletedPaymentIds(
              circle.id,
              chainId,
              tokensDistributed,
              pendingPayments,
              circle.paymentDetails,
              txHash
            );
          }
        }
      } catch (e: unknown) {
        console.error({ e });
        const err = e as {
          code?: string;
          name?: string;
        };
        if (err.code === "ACTION_REJECTED") {
          toast.error("You rejected requested action");
        } else if (err.name === "ConnectorNotFoundError") {
          openConnectModal && openConnectModal();
          toast.error(
            "Please login to your wallet and connect it to Spect, wallet might be locked"
          );
        } else toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (circle) {
      if (paymentId) {
        setValue(circle.paymentDetails[paymentId as string]);
        setIsCardDrawerOpen(true);
      } else if (newCard) {
        setValue({
          type: "Manually Added",
          chain: {
            value: circle.defaultPayment?.chain?.chainId,
            label: circle.defaultPayment?.chain?.name,
          },
          token: {
            value: "",
            label: "",
          },
          paidTo: [],
          title: "",
          id: "",
          value: 0,
        });
        setIsCardDrawerOpen(true);
      } else {
        setIsCardDrawerOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, newCard]);

  return {
    memberDetails,
    isCardDrawerOpen,
    setIsCardDrawerOpen,
    newCard,
    paymentId,
    status,
    paymentDetails: circle?.paymentDetails,
    value,
    setValue,
    pay,
    loading,
    setLoading,
  };
}
