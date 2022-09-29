import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { getNonce } from "@/app/services/Gnosis";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import useERC20 from "@/app/services/Payment/useERC20";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { updateRetro } from "@/app/services/Retro";
import { BatchPayInfo, CircleType, ProjectType, Registry } from "@/app/types";
import { Avatar, Box, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useLocalCard } from "../CreateCardModal/hooks/LocalCardContext";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function OneClickPayment() {
  const { getMemberDetails } = useModalOptions();
  const { payUsingGnosis, batchPay, payGasless } = usePaymentGateway();
  const { approve, isApproved } = useERC20();
  const { updateProject, localProject: project } = useLocalProject();
  const { setCard, cardId } = useLocalCard();
  const [loading, setLoading] = useState(false);
  const [gnosisLoading, setGnosisLoading] = useState(false);
  const [personalWalletLoading, setPersonalWalletLoading] = useState(false);

  const { batchPayInfo, setStep, currencyCards, tokenCards, setIsOpen } =
    useBatchPayContext();
  const { activeChain, switchNetworkAsync } = useNetwork();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { circle } = useCircle();

  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });
  const [tokenStatus, setTokenStatus] = useState<{
    [tokenAddress: string]: {
      loading: boolean;
      approved: boolean;
      safeApproved: boolean;
      error: string;
    };
  }>({} as any);
  const { data } = useAccount();

  const circleSafe =
    (circle?.safeAddresses &&
      batchPayInfo &&
      circle?.safeAddresses[batchPayInfo?.chainId] &&
      circle?.safeAddresses[batchPayInfo?.chainId][0]) ||
    "";

  const formatRows = () => {
    const rows: any[] = [];
    batchPayInfo?.currency?.userIds.forEach((userId, index) => {
      return rows.push([
        <Stack key={index} direction="horizontal" align="center">
          <Avatar
            src={
              batchPayInfo.payCircle
                ? getCircleDetails(userId)?.avatar
                : getMemberDetails(userId)?.avatar
            }
            label=""
            size="8"
            address={getMemberDetails(userId)?.ethAddress}
          />
          <Text variant="base" weight="semiBold">
            {batchPayInfo.payCircle
              ? getCircleDetails(userId)?.name
              : getMemberDetails(userId)?.username}
          </Text>
        </Stack>,
        <Text variant="base" weight="semiBold" key={userId}>
          {batchPayInfo.currency.values[index]?.toFixed(2)}{" "}
          {registry && registry[batchPayInfo.chainId]?.nativeCurrency}
        </Text>,
      ]);
    });
    batchPayInfo?.tokens?.userIds.forEach((userId, index) => {
      return rows.push([
        <Stack key={index} direction="horizontal" align="center">
          <Avatar
            src={
              batchPayInfo.payCircle
                ? getCircleDetails(userId)?.avatar
                : getMemberDetails(userId)?.avatar
            }
            label=""
            size="8"
            address={getMemberDetails(userId)?.ethAddress}
          />
          <Text variant="base" weight="semiBold">
            {batchPayInfo.payCircle
              ? getCircleDetails(userId)?.name
              : getMemberDetails(userId)?.username}
          </Text>
        </Stack>,
        <Text variant="base" weight="semiBold" key={userId}>
          {batchPayInfo.tokens.values[index]?.toFixed(2)}{" "}
          {registry &&
            registry[batchPayInfo?.chainId].tokenDetails[
              batchPayInfo.tokens.tokenAddresses[index]
            ]?.symbol}
        </Text>,
      ]);
    });
    return rows;
  };

  const recordPayment = async (txnHash: string, cardIds: string[]) => {
    if (txnHash) {
      if (!batchPayInfo?.retroId && cardIds && cardIds.length > 0) {
        const res: ProjectType = await updatePaymentInfo(cardIds, txnHash, {
          type: "project",
          id: project?.id,
        });
        if (res) {
          console.log({ res });
          updateProject && updateProject(res);
          setCard && setCard(res.cards[cardId]);
        }
      } else {
        const retroUpdateRes = await updateRetro(batchPayInfo?.retroId || "", {
          reward: {
            transactionHash: txnHash,
          },
          status: {
            paid: true,
          },
        });
        if (retroUpdateRes) {
          toast.success("Retro payout successful!");
        }
      }
    }
  };

  const filterUnapprovedTokens = (type: string) => {
    const filteredBatchPayInfo = {
      values: [] as number[],
      tokenAddresses: [] as string[],
      userIds: [] as string[],
      cardIds: [] as string[],
    };
    batchPayInfo?.tokens.tokenAddresses?.forEach((tokenAddress, index) => {
      if (tokenStatus[tokenAddress]?.approved) {
        filteredBatchPayInfo.tokenAddresses.push(tokenAddress);
        filteredBatchPayInfo.values.push(batchPayInfo.tokens.values[index]);
        filteredBatchPayInfo.userIds.push(batchPayInfo.tokens.userIds[index]);
      }
    });
    if (type === "card")
      tokenCards?.forEach((cardId) => {
        if (tokenStatus[project.cards[cardId].reward.token.address].approved) {
          filteredBatchPayInfo.cardIds.push(cardId);
        }
      });
    return filteredBatchPayInfo;
  };

  useEffect(() => {
    // initialize tokenStatus
    setLoading(true);
    if (
      circle &&
      activeChain?.id.toString() === batchPayInfo?.chainId &&
      registry
    ) {
      const tokenStatus: any = {};
      let index = 0;
      batchPayInfo?.approval.tokenAddresses.forEach(async (address: string) => {
        let safeApprovalStatus, approvalStatus;
        if (circleSafe)
          safeApprovalStatus = await isApproved(
            address,
            registry[batchPayInfo?.chainId].distributorAddress as string,
            batchPayInfo.approval.values[index],
            circleSafe
          );

        if (data?.address)
          approvalStatus = await isApproved(
            address,
            registry[batchPayInfo?.chainId].distributorAddress as string,
            batchPayInfo.approval.values[index],
            data.address
          );
        tokenStatus[address] = {
          loading: false,
          approved: approvalStatus,
          safeApproved: safeApprovalStatus,
          error: "",
        };
        if (index === batchPayInfo.approval.tokenAddresses.length - 1) {
          setTokenStatus(tokenStatus);
        }
        setLoading(false);
        index++;
      });
    } else {
      try {
        switchNetworkAsync &&
          void switchNetworkAsync(
            parseInt(batchPayInfo?.chainId as string)
          ).catch((err: any) => {
            toast.error(err.message);
            setIsOpen(false);
            setLoading(false);
          });
        setLoading(false);
      } catch (err: any) {
        toast.error(err.message);
        setIsOpen(false);
        setLoading(false);
      }
    }
    // set to final step if all tokens approved
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchPayInfo, activeChain]);

  const getEthAddress = (specificUserIds: string[], payCircle: boolean) => {
    return specificUserIds.map((userId) => {
      if (payCircle) return getCircleDetails(userId)?.paymentAddress;
      else return getMemberDetails(userId)?.ethAddress;
    });
  };

  const getCircleDetails = (circleId: string) => {
    return circle?.children.find((child) => child.id === circleId);
  };
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Table
          columns={[batchPayInfo?.payCircle ? "Circles" : "Members", "Amount"]}
          rows={formatRows()}
        />
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
          {batchPayInfo?.chainId && (
            <Box width="1/2">
              <PrimaryButton
                loading={personalWalletLoading}
                disabled={gnosisLoading}
                onClick={async () => {
                  setPersonalWalletLoading(true);
                  // if (
                  //   (batchPayInfo.chainId === "137" ||
                  //     batchPayInfo.chainId === "80001") &&
                  //   batchPayInfo?.currency.values?.length > 0
                  // ) {
                  //   await payGasless({
                  //     chainId: batchPayInfo?.chainId || "",
                  //     paymentType: "currency",
                  //     batchPayType: batchPayInfo?.retroId ? "retro" : "card",
                  //     userAddresses: getEthAddress(
                  //       batchPayInfo?.currency.userIds
                  //     ) as string[],
                  //     amounts: batchPayInfo?.currency.values,
                  //     tokenAddresses: [""],
                  //     cardIds: batchPayInfo?.retroId
                  //       ? [batchPayInfo.retroId]
                  //       : (currencyCards as string[]),
                  //     circleId: circle?.id || "",
                  //   });
                  //   setPersonalWalletLoading(false);
                  //   return;
                  // }
                  if (batchPayInfo?.currency.values?.length > 0) {
                    const currencyTxnHash = await toast
                      .promise(
                        batchPay({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "currency",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
                          userAddresses: getEthAddress(
                            batchPayInfo?.currency.userIds,
                            batchPayInfo.payCircle
                          ) as string[],
                          amounts: batchPayInfo?.currency.values,
                          tokenAddresses: [""],
                          cardIds: batchPayInfo?.retroId
                            ? [batchPayInfo.retroId]
                            : (currencyCards as string[]),
                          circleId: circle?.id || "",
                        }),
                        {
                          pending: `Distributing ${
                            (registry &&
                              registry[batchPayInfo.chainId]?.nativeCurrency) ||
                            "Network Gas Token"
                          }`,
                          error: {
                            render: ({ data }) => data,
                          },
                        },
                        {
                          position: "top-center",
                        }
                      )
                      .catch((err) => console.log(err));
                    if (currencyTxnHash)
                      await recordPayment(
                        currencyTxnHash,
                        currencyCards as string[]
                      );
                  }
                  if (batchPayInfo?.tokens.values?.length > 0) {
                    for (const [erc20Address, status] of Object.entries(
                      tokenStatus
                    )) {
                      if (!status.approved) {
                        await toast.promise(
                          approve(batchPayInfo?.chainId, erc20Address).then(
                            (res: any) => {
                              if (res) {
                                const approvedTokens = Object.assign(
                                  tokenStatus,
                                  {
                                    [erc20Address]: {
                                      ...tokenStatus[erc20Address],
                                      approved: true,
                                    },
                                  }
                                );
                                setTokenStatus(approvedTokens);
                              }
                            }
                          ),
                          {
                            pending: `Approving ${
                              (registry &&
                                registry[batchPayInfo.chainId]?.tokenDetails[
                                  erc20Address
                                ]?.name) ||
                              "Token"
                            }`,
                            error: {
                              render: ({ data }) => data,
                            },
                          },
                          {
                            position: "top-center",
                          }
                        );
                      }
                    }
                    const batchPayType = batchPayInfo?.retroId
                      ? "retro"
                      : "card";
                    const filteredBatchPayInfo =
                      filterUnapprovedTokens(batchPayType);
                    if (filteredBatchPayInfo.tokenAddresses?.length === 0) {
                      toast.error("No approved tokens to distribute");
                      setPersonalWalletLoading(false);
                      return;
                    }
                    setPersonalWalletLoading(true);
                    // if (
                    //   (batchPayInfo.chainId === "137" ||
                    //     batchPayInfo.chainId === "80001") &&
                    //   batchPayInfo?.tokens.values?.length > 0
                    // ) {
                    //   await payGasless({
                    //     chainId: batchPayInfo?.chainId || "",
                    //     paymentType: "tokens",
                    //     batchPayType: batchPayType,
                    //     userAddresses: getEthAddress(
                    //       filteredBatchPayInfo.userIds
                    //     ) as string[],
                    //     amounts: filteredBatchPayInfo.values,
                    //     tokenAddresses: filteredBatchPayInfo.tokenAddresses,
                    //     cardIds: batchPayInfo?.retroId
                    //       ? [batchPayInfo.retroId]
                    //       : filteredBatchPayInfo.cardIds,
                    //     circleId: circle?.id || "",
                    //   });
                    //   setPersonalWalletLoading(false);
                    //   return;
                    // }
                    const tokenTxnHash = await toast
                      .promise(
                        batchPay({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "tokens",
                          batchPayType: batchPayType,
                          userAddresses: getEthAddress(
                            filteredBatchPayInfo.userIds,
                            batchPayInfo.payCircle
                          ) as string[],
                          amounts: filteredBatchPayInfo.values,
                          tokenAddresses: filteredBatchPayInfo.tokenAddresses,
                          cardIds: batchPayInfo?.retroId
                            ? [batchPayInfo.retroId]
                            : filteredBatchPayInfo.cardIds,
                          circleId: circle?.id || "",
                        }),
                        {
                          pending: `Distributing Approved Tokens`,
                          error: {
                            render: ({ data }) => data,
                          },
                        },
                        {
                          position: "top-center",
                        }
                      )
                      .catch((err) => console.log(err));
                    if (tokenTxnHash)
                      await recordPayment(
                        tokenTxnHash,
                        filteredBatchPayInfo.cardIds
                      );
                  }
                  setPersonalWalletLoading(false);
                  setIsOpen(false);
                }}
              >
                Pay
              </PrimaryButton>
            </Box>
          )}
          {batchPayInfo?.chainId &&
            circle?.safeAddresses &&
            circle?.safeAddresses[batchPayInfo?.chainId] && (
              <Box width="1/2">
                <PrimaryButton
                  loading={gnosisLoading}
                  disabled={personalWalletLoading}
                  onClick={async () => {
                    setGnosisLoading(true);
                    let nonce = await getNonce(circleSafe);
                    if (batchPayInfo?.currency.values?.length > 0) {
                      await toast.promise(
                        payUsingGnosis({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "currency",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
                          userAddresses: getEthAddress(
                            batchPayInfo?.currency.userIds,
                            batchPayInfo.payCircle
                          ) as string[],
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
                          nonce,
                        }).then((res: any) => {
                          if (res) nonce += 1;
                        }),
                        {
                          pending: `Distributing ${
                            (registry &&
                              registry[batchPayInfo.chainId]?.nativeCurrency) ||
                            "Network Gas Token"
                          }`,
                        },
                        {
                          position: "top-center",
                        }
                      );
                    }
                    if (batchPayInfo?.tokens.values?.length > 0) {
                      for (const [erc20Address, status] of Object.entries(
                        tokenStatus
                      )) {
                        if (!status.safeApproved) {
                          await toast.promise(
                            approve(
                              batchPayInfo?.chainId,
                              erc20Address,
                              circleSafe,
                              nonce
                            )
                              .then((res: any) => {
                                nonce += 1;
                              })
                              .catch((err: any) => console.log(err)),
                            {
                              pending: `Approving ${
                                (registry &&
                                  registry[batchPayInfo.chainId]?.tokenDetails[
                                    erc20Address
                                  ]?.name) ||
                                "Token"
                              }`,
                            },
                            {
                              position: "top-center",
                            }
                          );
                        }
                      }
                      for (const [erc20Address, status] of Object.entries(
                        tokenStatus
                      )) {
                        if (!status.safeApproved) {
                          toast.info(
                            "Please confirm all the approvals sent to the multi-sig. Then, click Pay again."
                          );

                          setGnosisLoading(false);
                          setIsOpen(false);
                          return;
                        }
                      }

                      await toast.promise(
                        payUsingGnosis({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "tokens",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
                          userAddresses: getEthAddress(
                            batchPayInfo?.tokens.userIds,
                            batchPayInfo.payCircle
                          ) as string[],
                          amounts: batchPayInfo?.tokens.values,
                          tokenAddresses: batchPayInfo?.tokens.tokenAddresses,
                          safeAddress:
                            (batchPayInfo &&
                              circle?.safeAddresses[batchPayInfo.chainId][0]) ||
                            "",
                          cardIds: batchPayInfo?.retroId
                            ? [batchPayInfo.retroId]
                            : (tokenCards as string[]),
                          circleId: circle?.id || "",
                          nonce,
                        }),
                        {
                          pending: `Distributing Approved Tokens`,
                        },
                        {
                          position: "top-center",
                        }
                      );
                    }
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
