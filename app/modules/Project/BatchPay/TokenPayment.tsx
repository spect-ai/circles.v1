import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { updateRetro } from "@/app/services/Retro";
import { BatchPayInfo, CircleType, ProjectType, Registry } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useLocalCard } from "../CreateCardModal/hooks/LocalCardContext";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function TokenPayment() {
  const { getMemberDetails } = useModalOptions();
  const { batchPay, payUsingGnosis } = usePaymentGateway();
  const { updateProject } = useLocalProject();
  const { setCard, cardId } = useLocalCard();
  const { batchPayInfo, setStep, setIsOpen, tokenCards, setBatchPayInfo } =
    useBatchPayContext();

  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  const formatRows = () => {
    if (!registry) return [];
    const rows: any[] = [];
    batchPayInfo?.tokens?.userIds.forEach((userId, index) => {
      return rows.push([
        <Stack key={index} direction="horizontal" align="center">
          <Avatar
            src={getMemberDetails(userId)?.avatar}
            placeholder={!getMemberDetails(userId)?.avatar}
            label=""
            size="8"
            address={getMemberDetails(userId)?.ethAddress}
          />
          <Text variant="base" weight="semiBold">
            {getMemberDetails(userId)?.username}
          </Text>
        </Stack>,
        <Text variant="base" weight="semiBold" key={userId}>
          {batchPayInfo.tokens.values[index]}{" "}
          {
            registry[batchPayInfo?.chainId].tokenDetails[
              batchPayInfo.tokens.tokenAddresses[index]
            ].symbol
          }
        </Text>,
      ]);
    });
    return rows;
  };

  const getEthAddress = () => {
    return batchPayInfo?.tokens.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };

  return (
    <Box>
      <ScrollContainer padding="8">
        <Text variant="extraLarge" weight="semiBold">
          Token Payment
        </Text>
        <Box paddingY="4" />
        <Table columns={["Member", "Amount"]} rows={formatRows()} />
      </ScrollContainer>
      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setIsOpen(false);
                setStep(-1);
              }}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              onClick={async () => {
                const txnHash = await toast.promise(
                  batchPay({
                    chainId: batchPayInfo?.chainId || "",
                    paymentType: "tokens",
                    batchPayType: batchPayInfo?.retroId ? "retro" : "card",
                    userAddresses: getEthAddress() as string[],
                    amounts: batchPayInfo?.currency.values as number[],
                    tokenAddresses: batchPayInfo?.tokens
                      .tokenAddresses as string[],
                    cardIds: batchPayInfo?.retroId
                      ? [batchPayInfo.retroId]
                      : (tokenCards as string[]),
                    circleId: circle?.id || "",
                  }),
                  {
                    pending: "Transaction is pending",
                    success: {
                      render: "Success",
                    },
                    error: {
                      render: ({ data }) => data,
                    },
                  }
                );
                console.log({ txnHash });
                if (txnHash) {
                  if (!batchPayInfo?.retroId) {
                    const res: ProjectType = await updatePaymentInfo(
                      tokenCards as string[],
                      txnHash,
                      {
                        type: "project",
                        id: pId as string,
                      }
                    );
                    console.log({ res });
                    if (res) {
                      updateProject && updateProject(res);
                      setCard && setCard(res.cards[cardId]);

                      console.log({ res });
                      setIsOpen(false);
                      setStep(0);
                      setBatchPayInfo({} as BatchPayInfo);
                    }
                  } else {
                    const retroUpdateRes = await updateRetro(
                      batchPayInfo?.retroId || "",
                      {
                        reward: {
                          transactionHash: txnHash,
                        },
                        status: {
                          paid: true,
                        },
                      }
                    );
                    if (retroUpdateRes) {
                      toast.success("Retro payout successful!");
                    }
                  }
                }
              }}
            >
              Pay
            </PrimaryButton>
          </Box>
          {batchPayInfo?.chainId &&
            circle?.safeAddresses[batchPayInfo?.chainId] && (
              <Box width="1/2">
                <PrimaryButton
                  // loading={loading}
                  onClick={async () => {
                    await payUsingGnosis({
                      chainId: batchPayInfo?.chainId || "",
                      paymentType: "tokens",
                      batchPayType: batchPayInfo?.retroId ? "retro" : "card",
                      userAddresses: getEthAddress() as string[],
                      amounts: batchPayInfo?.currency.values,
                      tokenAddresses: batchPayInfo?.tokens.tokenAddresses,
                      safeAddress:
                        (batchPayInfo &&
                          circle?.safeAddresses[batchPayInfo.chainId][0]) ||
                        "",
                      cardIds: batchPayInfo?.retroId
                        ? [batchPayInfo.retroId]
                        : (tokenCards as string[]),
                      circleId: circle?.id || "",
                    });
                    setIsOpen(false);
                  }}
                >
                  Pay Using Gnosis
                </PrimaryButton>
              </Box>
            )}
        </Stack>
      </Box>
    </Box>
  );
}
