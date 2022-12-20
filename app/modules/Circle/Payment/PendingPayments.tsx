import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  approveUsingEOA,
  filterTokensByAllowanceOrBalance,
  findAggregatedAmountForEachToken,
  findPendingPaymentsByNetwork,
  flattenAmountByEachUniqueTokenAndUser,
  getUniqueNetworks,
  hasAllowance,
  hasBalances,
  payUsingEOA,
  switchNetwork,
} from "@/app/services/Paymentv2/utils";
import { MemberDetails, Registry, UserType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../CircleContext";
import PaymentCard from "./PaymentCard";

type Props = {};

export default function PendingPayments({}: Props) {
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const router = useRouter();

  const { circle } = useCircle();
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
        <Box width="72" display="flex" flexDirection="column" gap="4">
          <Text variant="small">
            You have no pending payments. Add a pending payment to get started.
          </Text>
          <PrimaryButton
            variant="tertiary"
            onClick={() => setIsCardDrawerOpen(true)}
          >
            Add a Pending Payment
          </PrimaryButton>
        </Box>
      </Box>
    );

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
        <Box width="36">
          <PrimaryButton
            onClick={() => {
              try {
                const uniqueNetworks = getUniqueNetworks(
                  circle.pendingPayments,
                  circle.paymentDetails
                );
                console.log({ uniqueNetworks });
                uniqueNetworks.forEach(async (chainId) => {
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

                  const aggregatedAmounts =
                    findAggregatedAmountForEachToken(amounts);
                  console.log({ aggregatedAmounts });
                  const hasRequiredBalances = hasBalances(
                    chainId,
                    currentUser?.ethAddress as string,
                    aggregatedAmounts
                  );
                  console.log({ hasRequiredBalances });

                  const hasRequiredAllowances = await hasAllowance(
                    registry as Registry,
                    chainId,
                    currentUser?.ethAddress as string,
                    aggregatedAmounts
                  );
                  console.log({ hasRequiredAllowances });

                  const tokensWithInsufficientBalance =
                    filterTokensByAllowanceOrBalance(
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

                  const tokensWithSufficientBalance =
                    filterTokensByAllowanceOrBalance(
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
                  await switchNetwork(chainId);

                  const tokensWithInsufficientAllowance =
                    filterTokensByAllowanceOrBalance(
                      chainId,
                      hasRequiredAllowances,
                      registry as Registry,
                      false
                    );

                  console.log("Approving ...");
                  await approveUsingEOA(
                    chainId,
                    tokensWithInsufficientAllowance.map(
                      (token) => token.tokenAddress
                    ),
                    registry as Registry
                  );

                  console.log("Distributing ...");
                  await payUsingEOA(
                    chainId,
                    amounts,
                    tokensWithInsufficientAllowance.map(
                      (token) => token.tokenAddress
                    ),
                    tokensWithInsufficientBalance.map(
                      (token) => token.tokenAddress
                    ),
                    registry as Registry
                  );
                });
              } catch (e: any) {
                console.log(e);
                if (e.code === "ACTION_REJECTED") {
                  toast.error("You've rejected the request.");
                }
              }
            }}
          >
            Batch Pay
          </PrimaryButton>
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
