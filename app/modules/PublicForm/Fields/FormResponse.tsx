/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @next/next/no-img-element */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FormType, Registry, UserType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, IconDocumentsSolid, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import styled from "styled-components";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import _ from "lodash";
import { useAtom } from "jotai";
import { connectedUserAtom, socketAtom } from "@/app/state/global";

type Props = {
  form: FormType;
  setSubmitAnotherResponse: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  setUpdateResponse: (val: boolean) => void;
  surveyTokenClaimed: boolean;
  setSurveyTokenClaimed: (val: boolean) => void;
  surveyDistributionInfo: {
    amountPerResponse: ethers.BigNumber;
  };
  surveyIsLotteryYetToBeDrawn: boolean;
  surveyHasInsufficientBalance: boolean;
  canClaimSurveyToken: boolean;
  setCanClaimSurveyToken: (val: boolean) => void;
  registry?: Registry;
};

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 18rem;
  }
  width: 24rem;
`;

const FormResponse = ({
  form,
  setSubmitAnotherResponse,
  setSubmitted,
  setUpdateResponse,
  surveyTokenClaimed,
  setSurveyTokenClaimed,
  surveyDistributionInfo,
  surveyIsLotteryYetToBeDrawn,
  surveyHasInsufficientBalance,
  canClaimSurveyToken,
  setCanClaimSurveyToken,
  registry,
}: Props) => {
  const { width, height } = useWindowSize();
  const [claiming, setClaiming] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);
  const router = useRouter();
  const { formId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [socket] = useAtom(socketAtom);
  const [connectedUser] = useAtom(connectedUserAtom);

  const [surveyTokenClaimTransactionHash, setSurveyTokenClaimTransactionHash] =
    useState(
      form?.formMetadata?.transactionHashesOfUser?.surveyTokenClaim || ""
    );

  useEffect(() => {
    socket?.on(
      `${formId}:responseAddedOnChain`,
      _.debounce(async (event: { userAddress: string }) => {
        if (event.userAddress === currentUser?.ethAddress) {
          setCanClaimSurveyToken(true);
        }
      }, 2000)
    );
    return () => {
      if (socket && socket.off) {
        socket.off(`${formId}:newActivityPublic`);
      }
    };
  }, [connectedUser, formId, socket]);

  return (
    <Box>
      <Box paddingLeft="6">
        <Text variant="large" align="left">
          {`${
            form?.formMetadata.messageOnSubmission ||
            "Your response has been submitted!"
          }`}
        </Text>
      </Box>
      <Box
        padding={{
          xs: "2",
          md: "8",
        }}
      >
        {claimedJustNow && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            gravity={0.07}
            numberOfPieces={600}
          />
        )}
        <Stack>
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
                  src="https://ik.imagekit.io/spectcdn/moneybagethereummb3dmodel001.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676107655114"
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
                      ? surveyDistributionInfo?.amountPerResponse
                        ? `You have claimed ${ethers.utils.formatEther(
                            surveyDistributionInfo?.amountPerResponse?.toString()
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
                      url="https://circles.spect.network/"
                      title="I just filled out a web3 form and claimed some tokens on @JoinSpect 💰"
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
                                registry?.[
                                  form.formMetadata.surveyChain?.value || ""
                                ].blockExplorer
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
                  surveyHasInsufficientBalance && (
                    <Stack direction="horizontal" align="flex-start">
                      <Text variant="extraLarge" weight="bold">
                        👉
                      </Text>
                      <Text weight="bold" variant="large">
                        Looks like all
                        {form.formMetadata.surveyToken?.label}
                        for this form have been claimed, please reach out to
                        form creator
                      </Text>
                    </Stack>
                  )}
                {form.formMetadata?.previousResponses?.length > 0 &&
                  form.formMetadata?.surveyTokenId &&
                  !surveyIsLotteryYetToBeDrawn &&
                  !surveyHasInsufficientBalance && (
                    <Stack direction="horizontal" align="flex-start">
                      <Text variant="extraLarge" weight="bold">
                        👉
                      </Text>
                      <Stack>
                        <Text weight="semiBold" variant="large">
                          {form.formMetadata.surveyDistributionType === 1
                            ? surveyDistributionInfo?.amountPerResponse
                              ? `You are eligible to receive ${ethers.utils.formatEther(
                                  surveyDistributionInfo?.amountPerResponse?.toString()
                                )} ${
                                  form.formMetadata.surveyToken?.label
                                } for submitting a response
                    💰`
                              : "You are eligible to receive tokens 💰"
                            : `You are eligible to receive ${form.formMetadata.surveyTotalValue} ${form.formMetadata.surveyToken?.label} for submitting a response 💰`}
                        </Text>
                        {!canClaimSurveyToken && (
                          <Text variant="small">
                            It takes a few seconds for your response to be
                            processed, after which you will be able to claim
                            your tokens.
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
                            disabled={!canClaimSurveyToken}
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
                                if (res.ok) {
                                  const data = await res.json();
                                  setSurveyTokenClaimed(true);
                                  setClaimedJustNow(true);
                                  setSurveyTokenClaimTransactionHash(
                                    data.transactionHash
                                  );
                                }
                              } catch (e) {
                                console.error(e);
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
                  )}
              </Box>
            )}
          </Box>
          <Box
            width="full"
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            marginTop="8"
          >
            <Box
              width="full"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <Stack>
                {form?.formMetadata.updatingResponseAllowed &&
                  form?.formMetadata.active &&
                  form.formMetadata.walletConnectionRequired && (
                    <PrimaryButton
                      variant="transparent"
                      onClick={() => {
                        setUpdateResponse(true);
                        setSubmitted(false);
                      }}
                    >
                      Update response
                    </PrimaryButton>
                  )}
                {/* {form.formMetadata.walletConnectionRequired && (
                <PrimaryButton
                  variant="transparent"
                  onClick={() => {
                    setUpdateResponse(true);
                    setViewResponse(true);
                    setSubmitted(false);
                  }}
                >
                  View response
                </PrimaryButton>
              )} */}
                {form?.formMetadata.multipleResponsesAllowed &&
                  form?.formMetadata.active && (
                    <PrimaryButton
                      variant="transparent"
                      onClick={() => {
                        setSubmitAnotherResponse(true);
                      }}
                    >
                      Submit another response
                    </PrimaryButton>
                  )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

FormResponse.defaultProps = {
  registry: {},
};

export default FormResponse;
