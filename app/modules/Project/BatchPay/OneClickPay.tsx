import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { getNonce } from "@/app/services/Gnosis";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useERC20 from "@/app/services/Payment/useERC20";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { CircleType, Registry } from "@/app/types";
import { Avatar, Box, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useLocalCard } from "../CreateCardModal/hooks/LocalCardContext";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function OneClickPayment() {
  const { getMemberDetails } = useModalOptions();
  const { payUsingGnosis, batchPay } = usePaymentGateway();
  const { approve, isApproved } = useERC20();

  const [loading, setLoading] = useState(false);
  const [gnosisLoading, setGnosisLoading] = useState(false);
  const [personalWalletLoading, setPersonalWalletLoading] = useState(false);

  const { batchPayInfo, setStep, currencyCards, tokenCards, setIsOpen } =
    useBatchPayContext();
  const { activeChain, switchNetworkAsync } = useNetwork();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

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
          {registry &&
            registry[batchPayInfo?.chainId].tokenDetails[
              batchPayInfo.tokens.tokenAddresses[index]
            ].symbol}
        </Text>,
      ]);
    });
    return rows;
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
      console.log(batchPayInfo?.approval);
      batchPayInfo?.approval.tokenAddresses.forEach(async (address: string) => {
        let safeApprovalStatus, approvalStatus;
        if (circleSafe)
          safeApprovalStatus = await isApproved(
            address,
            registry[batchPayInfo?.chainId].distributorAddress as string,
            batchPayInfo.approval.values[index],
            circleSafe
          );
        //console.log(data.address);

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
          console.log(tokenStatus);
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
  }, [batchPayInfo, activeChain]);

  const getEthAddress = () => {
    return batchPayInfo?.currency.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };
  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
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
          {batchPayInfo?.chainId && (
            <Box width="1/2">
              <PrimaryButton
                loading={personalWalletLoading}
                disabled={gnosisLoading}
                onClick={async () => {
                  setPersonalWalletLoading(true);
                  if (batchPayInfo?.currency.values?.length > 0) {
                    await toast
                      .promise(
                        batchPay({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "currency",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
                          userAddresses: getEthAddress() as string[],
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
                  }
                  if (batchPayInfo?.tokens.values?.length > 0) {
                    for (const [erc20Address, status] of Object.entries(
                      tokenStatus
                    )) {
                      if (!status.approved) {
                        await toast.promise(
                          approve(batchPayInfo?.chainId, erc20Address).then(
                            (res: any) => {}
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
                    await toast
                      .promise(
                        batchPay({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "tokens",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
                          userAddresses: getEthAddress() as string[],
                          amounts: batchPayInfo?.currency.values,
                          tokenAddresses: batchPayInfo?.tokens.tokenAddresses,
                          cardIds: batchPayInfo?.retroId
                            ? [batchPayInfo.retroId]
                            : (tokenCards as string[]),
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
                            ).then((res: any) => {
                              nonce += 1;
                            }),
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
                      await toast.promise(
                        payUsingGnosis({
                          chainId: batchPayInfo?.chainId || "",
                          paymentType: "tokens",
                          batchPayType: batchPayInfo?.retroId
                            ? "retro"
                            : "card",
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
