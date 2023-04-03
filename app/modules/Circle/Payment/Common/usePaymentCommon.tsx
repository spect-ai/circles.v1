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
import {
  MemberDetails,
  Option,
  PaymentDetails,
  Registry,
  UserType,
} from "@/app/types";
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
          console.log({ paymentIdsBeingDistributed });
          const encoder = new AbiCoder();
          let id = { token: "", currency: "" };
          id["token"] = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id) => circle.paymentDetails[id].token.value !== "0x0"
              ),
            ]
          );

          id["currency"] = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id) => circle.paymentDetails[id].token.value === "0x0"
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

          const res = await findAndUpdatePaymentIdsPendingSignature(
            circle.id,
            chainId,
            tokensDistributed,
            pendingPayments,
            circle.paymentDetails,
            txHash
          );
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
          console.log({ paymentIdsBeingDistributed });
          console.log({
            user: currentUser?._id.toString(),
            circle: circle.id,
            paymentIdsBeingDistributed,
          });
          const encoder = new AbiCoder();
          let id = { token: "", currency: "" };
          id["token"] = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id) => circle.paymentDetails[id].token.value !== "0x0"
              ),
            ]
          );
          id["currency"] = encoder.encode(
            ["string", "string", "string[]"],
            [
              currentUser?._id.toString(),
              circle.id,
              paymentIdsBeingDistributed.filter(
                (id) => circle.paymentDetails[id].token.value === "0x0"
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
            console.log({ tokensDistributed, txHash });
            const res = await findAndUpdateCompletedPaymentIds(
              circle.id,
              chainId,
              tokensDistributed,
              pendingPayments,
              circle.paymentDetails,
              txHash
            );
          }
        }
      } catch (e: any) {
        console.log({ e });
        if (e.code === "ACTION_REJECTED")
          toast.error("You rejected requested action");
        else if (e.name === "ConnectorNotFoundError") {
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
