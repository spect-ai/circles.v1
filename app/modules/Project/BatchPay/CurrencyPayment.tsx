import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { updateRetro } from "@/app/services/Retro";
import { CircleType, Registry } from "@/app/types";
import { QuestionCircleFilled } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useLocalCard } from "../CreateCardModal/hooks/LocalCardContext";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function CurrencyPayment() {
  const { getMemberDetails } = useModalOptions();
  const { batchPay, payUsingGnosis } = usePaymentGateway();
  const [loading, setLoading] = useState(false);
  const [gnosisLoading, setGnosisLoading] = useState(false);
  const { batchPayInfo, setStep, currencyCards, tokenCards, setIsOpen } =
    useBatchPayContext();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { updateProject } = useLocalProject();
  const { setCard, cardId } = useLocalCard();

  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const { mode } = useTheme();

  const formatRows = () => {
    const rows: any[] = [];
    batchPayInfo?.currency.userIds.forEach((userId, index) => {
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
          {batchPayInfo.currency.values[index]}{" "}
          {registry && registry[batchPayInfo.chainId]?.nativeCurrency}
        </Text>,
      ]);
    });
    return rows;
  };

  const getEthAddress = () => {
    return batchPayInfo?.currency.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Stack direction="horizontal" space="1" align="center">
          <Text variant="extraLarge" weight="semiBold">
            Currency Payment
          </Text>
          <Button shape="circle" size="small" variant="transparent">
            <Tooltip
              html={
                <Stack>
                  <Text>
                    Currency payment (network gas token) and token payment need
                    to happen separately
                  </Text>
                  <Text>
                    First we will payout the currency as it doesn&apos;t require
                    approvals
                  </Text>
                </Stack>
              }
              theme={mode}
            >
              <QuestionCircleFilled style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Button>
        </Stack>
        <Box paddingY="2" />
        <Table columns={["Member", "Amount"]} rows={formatRows()} />
      </ScrollContainer>
      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            {!batchPayInfo?.retroId && (
              <PrimaryButton
                tone="red"
                onClick={() => {
                  setStep(0);
                }}
              >
                Back
              </PrimaryButton>
            )}
          </Box>
          <Box width="1/2">
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const txnHash = await batchPay({
                    chainId: batchPayInfo?.chainId || "",
                    paymentType: "currency",
                    batchPayType: batchPayInfo?.retroId ? "retro" : "card",
                    userAddresses: getEthAddress() as string[],
                    amounts: batchPayInfo?.currency.values as number[],
                    tokenAddresses: [""],
                    cardIds: batchPayInfo?.retroId
                      ? [batchPayInfo.retroId]
                      : (currencyCards as string[]),
                    circleId: circle?.id || "",
                  });
                  console.log({ txnHash });
                  if (txnHash) {
                    if (!batchPayInfo?.retroId) {
                      const res = await updatePaymentInfo(
                        currencyCards as string[],
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

                        setLoading(false);
                        if (tokenCards && tokenCards?.length > 0) {
                          setStep(2);
                        } else {
                          setStep(0);
                          setIsOpen(false);
                        }
                      } else {
                        setLoading(false);
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
                      setIsOpen(false);
                      setLoading(false);
                    }
                  }
                  setLoading(false);
                } catch (error: any) {
                  setLoading(false);
                  console.log(error);
                  toast.error(error?.data?.message || "Something went wrong");
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
                  loading={gnosisLoading}
                  onClick={async () => {
                    setGnosisLoading(true);
                    if (chain?.id.toString() !== batchPayInfo?.chainId) {
                      switchNetworkAsync &&
                        batchPayInfo &&
                        (await switchNetworkAsync(
                          parseInt(batchPayInfo.chainId)
                        ));
                    }
                    await payUsingGnosis({
                      chainId: batchPayInfo?.chainId || "",
                      paymentType: "currency",
                      batchPayType: batchPayInfo?.retroId ? "retro" : "card",
                      userAddresses: getEthAddress() as string[],
                      amounts: batchPayInfo?.currency.values,
                      tokenAddresses: [""],
                      safeAddress:
                        (batchPayInfo &&
                          circle?.safeAddresses[batchPayInfo.chainId][0]) ||
                        "",
                      cardIds: batchPayInfo?.retroId
                        ? [batchPayInfo.retroId]
                        : (currencyCards as string[]),
                      circleId: circle?.id || "",
                    });
                    setGnosisLoading(false);
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
