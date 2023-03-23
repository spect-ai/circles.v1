import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  getEscrowBalance,
  getSurveyDistributionInfo,
  hasClaimedSurveyToken,
  isEligibleToClaimSurveyToken,
} from "@/app/services/SurveyProtocol";
import { CollectionType, Registry } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, IconDocumentsSolid, Stack, Text } from "degen";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

type Props = {
  form: CollectionType;
  setClaimedJustNow: (value: boolean) => void;
  preview?: boolean;
};

const CollectERC20 = ({ form, setClaimedJustNow, preview }: Props) => {
  const [distributionInfo, setDistributionInfo] = useState({} as any);
  const [escrowHasInsufficientBalance, setEscrowHasInsufficientBalance] =
    useState(false);
  const [canClaimSurveyToken, setCanClaimSurveyToken] = useState(false);
  const [surveyIsLotteryYetToBeDrawn, setSurveyIsLotteryYetToBeDrawn] =
    useState(false);
  const [surveyTokenClaimed, setSurveyTokenClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [surveyTokenClaimTransactionHash, setSurveyTokenClaimTransactionHash] =
    useState(
      form?.formMetadata?.transactionHashesOfUser?.surveyTokenClaim || ""
    );

  const { address } = useAccount();

  const { data: registry, refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", form.parents[0].slug],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/slug/${form.parents[0].slug}/getRegistry`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    fetchRegistry();
  }, []);

  useEffect(() => {
    if (
      form?.formMetadata?.surveyTokenId ||
      form?.formMetadata?.surveyTokenId === 0
    ) {
      void (async () => {
        if (!registry) return;
        const distributionInfo = (await getSurveyDistributionInfo(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number
        )) as any;
        console.log({ distributionInfo });
        setDistributionInfo(distributionInfo);

        if (
          distributionInfo?.distributionType === 0 &&
          distributionInfo?.requestId?.toString() === "0"
        ) {
          setSurveyIsLotteryYetToBeDrawn(true);
        }

        const surveyTokenClaimed = await hasClaimedSurveyToken(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number,
          address as string
        );
        setSurveyTokenClaimed(surveyTokenClaimed as boolean);

        const balanceInEscrow = (await getEscrowBalance(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number
        )) as BigNumber;
        const insufficientEscrowBalance =
          distributionInfo?.distributionType === 0
            ? balanceInEscrow.toString() === "0"
            : balanceInEscrow.lt(distributionInfo?.amountPerResponse || 0);
        console.log({ insufficientEscrowBalance });
        setEscrowHasInsufficientBalance(insufficientEscrowBalance);
        const canClaim =
          !insufficientEscrowBalance &&
          (await isEligibleToClaimSurveyToken(
            form.formMetadata.surveyChain?.value || "",
            registry[form.formMetadata.surveyChain?.value || ""]
              .surveyHubAddress,
            form.formMetadata.surveyTokenId as number,
            address as string,
            distributionInfo,
            surveyTokenClaimed as boolean
          ));

        console.log({ canClaim });
        setCanClaimSurveyToken(canClaim as boolean);
      })();
    }
  }, [form, registry]);

  return (
    <Box
      display="flex"
      flexDirection={{
        xs: "column",
        xl: "row",
      }}
      alignItems={{
        xs: "center",
        xl: "flex-start",
      }}
      gap="4"
      marginTop="8"
      padding="2"
    >
      {form.formMetadata?.surveyTokenId && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width={{
            xs: "full",
            xl: "1/2",
          }}
        >
          {" "}
          <StyledImage
            src={
              "https://ik.imagekit.io/spectcdn/moneybagethereummb3dmodel001.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676107655114"
            }
            alt="poap"
          />
        </Box>
      )}
      {surveyTokenClaimed ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={{
            xs: "full",
            xl: "1/2",
          }}
          gap="4"
        >
          <Box
            display="flex"
            flexDirection="row"
            gap="4"
            justifyContent={{
              xs: "center",
              xl: "flex-start",
            }}
          >
            {" "}
            <Text variant="extraLarge" weight="bold">
              🙌
            </Text>
            <Text variant="large" weight="bold">
              {form.formMetadata.surveyDistributionType === 1
                ? distributionInfo?.amountPerResponse
                  ? `You have claimed ${ethers.utils.formatEther(
                      distributionInfo?.amountPerResponse?.toString()
                    )} ${
                      form.formMetadata?.surveyToken?.label
                    } for responding to this form 💰`
                  : "You have claimed your tokens for responding to this form 💰"
                : `You have claimed ${form.formMetadata.surveyTotalValue} ${form.formMetadata.surveyToken?.label} for submitting a response 💰`}
            </Text>
          </Box>
          <Box>
            <Stack
              direction="vertical"
              justify="flex-start"
              align="flex-start"
              space="2"
            >
              <TwitterShareButton
                url={`https://circles.spect.network/`}
                title={
                  "I just filled out a web3 form and claimed some tokens on @JoinSpect 💰"
                }
              >
                <Box
                  width={{
                    xs: "full",
                    md: "48",
                  }}
                >
                  <PrimaryButton
                    variant="transparent"
                    icon={
                      <TwitterOutlined
                        style={{
                          fontSize: "1.8rem",
                          color: "rgb(29, 155, 240, 1)",
                        }}
                      />
                    }
                  >
                    <Text>Share on Twitter</Text>
                  </PrimaryButton>
                </Box>
              </TwitterShareButton>
              {registry && surveyTokenClaimTransactionHash && (
                <Box
                  width={{
                    xs: "full",
                    md: "48",
                  }}
                >
                  <PrimaryButton
                    variant="transparent"
                    icon={<IconDocumentsSolid color="white" />}
                    onClick={() => {
                      window.open(
                        `${
                          registry?.[form.formMetadata.surveyChain?.value || ""]
                            .blockExplorer
                        }tx/${surveyTokenClaimTransactionHash}`,
                        "_blank"
                      );
                    }}
                  >
                    <Text>View Transaction</Text>
                  </PrimaryButton>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent={{
            xs: "center",
            xl: "flex-start",
          }}
          alignItems="center"
          width={{
            xs: "full",
            xl: "1/2",
          }}
        >
          {form.formMetadata?.previousResponses?.length > 0 &&
            form.formMetadata?.surveyTokenId &&
            escrowHasInsufficientBalance && (
              <Stack direction="horizontal" align="flex-start">
                <Text variant="extraLarge" weight="bold">
                  👉
                </Text>
                <Text weight="bold" variant="large">
                  {" "}
                  Looks like all {form.formMetadata.surveyToken?.label} for this
                  form have been claimed, please reach out to form creator
                </Text>
              </Stack>
            )}
          {(form.formMetadata?.previousResponses?.length > 0 &&
            form.formMetadata?.surveyTokenId &&
            !surveyIsLotteryYetToBeDrawn &&
            !escrowHasInsufficientBalance) ||
            (form.formMetadata?.surveyTokenId && preview && (
              <Stack direction="horizontal" align="flex-start">
                <Text variant="extraLarge" weight="bold">
                  👉
                </Text>
                <Stack>
                  <Text weight="semiBold" variant="large">
                    {form.formMetadata.surveyDistributionType === 1
                      ? distributionInfo?.amountPerResponse
                        ? `You are eligible to receive ${ethers.utils.formatEther(
                            distributionInfo?.amountPerResponse?.toString()
                          )} ${
                            form.formMetadata.surveyToken?.label
                          } for submitting a response
            💰`
                        : `You are eligible to receive tokens 💰`
                      : `You are eligible to receive ${form.formMetadata.surveyTotalValue} ${form.formMetadata.surveyToken?.label} for submitting a response 💰`}
                  </Text>
                  {!canClaimSurveyToken && (
                    <Text variant="small">
                      It takes a few seconds for your response to be processed,
                      after which you will be able to claim your tokens.
                    </Text>
                  )}
                  <Box
                    width={{
                      xs: "48",
                      md: "72",
                    }}
                  >
                    {" "}
                    <PrimaryButton
                      loading={claiming}
                      disabled={canClaimSurveyToken ? false : true}
                      onClick={async () => {
                        setClaiming(true);
                        try {
                          const res = await fetch(
                            `${process.env.API_HOST}/collection/v1/${form?.id}/claimSurveyTokens`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          );

                          console.log(res);
                          if (res.ok) {
                            const data = await res.json();
                            setSurveyTokenClaimed(true);
                            setClaimedJustNow(true);
                            setSurveyTokenClaimTransactionHash(
                              data.transactionHash
                            );
                          }
                        } catch (e) {
                          console.log(e);
                          toast.error(
                            "Something went wrong, please try again later"
                          );
                        }

                        setClaiming(false);
                      }}
                    >
                      Claim Token
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Stack>
            ))}
        </Box>
      )}
    </Box>
  );
};

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 16rem;
  }
  width: 20rem;
`;

export default CollectERC20;
