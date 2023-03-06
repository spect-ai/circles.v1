/* eslint-disable @next/next/no-img-element */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  FormType,
  KudosType,
  POAPEventType,
  Registry,
  UserType,
} from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, Heading, IconDocumentsSolid, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import styled from "styled-components";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { PassportStampIcons } from "@/app/assets";
import { useRouter } from "next/router";
import _ from "lodash";
import { useAtom } from "jotai";
import { connectedUserAtom, socketAtom } from "@/app/state/global";

type Props = {
  form: FormType;
  kudos: KudosType;
  setSubmitAnotherResponse: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  setUpdateResponse: (val: boolean) => void;
  claimed: boolean;
  setClaimed: (val: boolean) => void;
  surveyTokenClaimed: boolean;
  setSurveyTokenClaimed: (val: boolean) => void;
  surveyDistributionInfo: any;
  surveyIsLotteryYetToBeDrawn: boolean;
  surveyHasInsufficientBalance: boolean;
  canClaimSurveyToken: boolean;
  setCanClaimSurveyToken: (val: boolean) => void;
  setViewResponse: (val: boolean) => void;
  poap: POAPEventType;
  poapClaimed: boolean;
  setPoapClaimed: (val: boolean) => void;
  poapClaimCode: string;
  registry?: Registry;
};

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 18rem;
  }
  width: 24rem;
`;

const CircularStyledImage = styled.img`
  @media (max-width: 768px) {
    width: 18rem;
  }
  width: 24rem;
  border-radius: 20rem;
`;

export default function FormResponse({
  form,
  kudos,
  poap,
  setSubmitAnotherResponse,
  setSubmitted,
  setUpdateResponse,
  claimed,
  setClaimed,
  surveyTokenClaimed,
  setSurveyTokenClaimed,
  surveyDistributionInfo,
  surveyIsLotteryYetToBeDrawn,
  surveyHasInsufficientBalance,
  canClaimSurveyToken,
  setCanClaimSurveyToken,
  setViewResponse,
  poapClaimed,
  setPoapClaimed,
  poapClaimCode,
  registry,
}: Props) {
  const { width, height } = useWindowSize();
  const [claiming, setClaiming] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);
  const router = useRouter();
  const { formId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [socket, setSocket] = useAtom(socketAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  const [surveyTokenClaimTransactionHash, setSurveyTokenClaimTransactionHash] =
    useState(
      form?.formMetadata?.transactionHashesOfUser?.surveyTokenClaim || ""
    );

  useEffect(() => {
    socket?.on(
      `${formId}:responseAddedOnChain`,
      _.debounce(async (event: { userAddress: string }) => {
        console.log({ event, connectedUser, currentUser });
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
        <Text variant="extraLarge" align="left">{`${
          form?.formMetadata.messageOnSubmission ||
          "Your response has been submitted!"
        }`}</Text>
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
          {poap?.image_url && (poapClaimed || form.formMetadata.poapEventId) && (
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
              <CircularStyledImage src={`${poap?.image_url}`} alt="poap" />
            </Box>
          )}
          {poapClaimed ? (
            <Stack>
              <Text variant="extraLarge" weight="bold">
                You have claimed this Poap 🏅
              </Text>
              <Box>
                <Stack direction="vertical">
                  <TwitterShareButton
                    url={`https://circles.spect.network/`}
                    title={
                      "I just filled out a web3 form and claimed my @poapxyz on @JoinSpect!"
                    }
                  >
                    <Box
                      width={{
                        xs: "full",
                        md: "72",
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

                  <Box
                    width={{
                      xs: "full",
                      md: "72",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      icon={PassportStampIcons["POAP"]}
                      onClick={() => {
                        window.open(`https://app.poap.xyz/`, "_blank");
                      }}
                    >
                      {" "}
                      <Text>View on poap.xyz</Text>
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Box>
            </Stack>
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
              {form.formMetadata.poapEventId && !poapClaimed && (
                <Stack direction="horizontal" align="flex-start">
                  <Box>
                    {" "}
                    <Text variant="extraLarge" weight="bold">
                      👉
                    </Text>
                  </Box>
                  <Stack>
                    <Text weight="semiBold" variant="large">
                      You are eligible to receive a POAP for submitting a
                      response 🏅
                    </Text>
                    <Box
                      width={{
                        xs: "48",
                        md: "72",
                      }}
                    >
                      <PrimaryButton
                        loading={claiming}
                        onClick={async () => {
                          setClaiming(true);
                          try {
                            const res = await (
                              await fetch(
                                `${process.env.API_HOST}/collection/v1/${form.id}/claimPoap`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  credentials: "include",
                                  body: JSON.stringify({
                                    claimCode: poapClaimCode.toString(),
                                  }),
                                }
                              )
                            ).json();

                            console.log(res);
                            if (res.claimed) {
                              setPoapClaimed(true);
                              setClaimedJustNow(true);
                            } else if (res.statusCode === 500) {
                              if (res.message.includes("dssd"))
                                toast.error(
                                  "All POAPs have been claimed for this form, please ask the form creator to request more"
                                );
                              else
                                toast.error(
                                  "Something went wrong, please try again later"
                                );
                            }
                          } catch (e: any) {
                            toast.error(
                              "Something went wrong, please try again later"
                            );
                          }

                          setClaiming(false);
                        }}
                      >
                        Claim POAP
                      </PrimaryButton>
                    </Box>
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
        </Box>

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
          {surveyIsLotteryYetToBeDrawn && (
            <Box>
              <Text variant="large" weight="bold">
                Responders to this survey will automatically be added to a
                lottery to win {form.formMetadata.surveyTotalValue}{" "}
                {form.formMetadata?.surveyToken?.label}
              </Text>
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
                      {" "}
                      Looks like all {form.formMetadata.surveyToken?.label} for
                      this form have been claimed, please reach out to form
                      creator
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
                            : `You are eligible to receive tokens 💰`
                          : `You are eligible to receive ${form.formMetadata.surveyTotalValue} ${form.formMetadata.surveyToken?.label} for submitting a response 💰`}
                      </Text>
                      {!canClaimSurveyToken && (
                        <Text variant="small">
                          It takes a few seconds for your response to be
                          processed, after which you will be able to claim your
                          tokens.
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
                )}
            </Box>
          )}
        </Box>
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
          {kudos?.imageUrl && (claimed || form.formMetadata.canClaimKudos) && (
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
              <StyledImage src={`${kudos.imageUrl}`} alt="kudos" />
            </Box>
          )}
          {claimed ? (
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
                alignItems="center"
              >
                <Text variant="extraLarge" weight="bold">
                  🙌{" "}
                </Text>
                <Text variant="extraLarge" weight="bold">
                  You have claimed this Kudos 🎉
                </Text>
              </Box>
              <Box>
                <Stack direction="vertical">
                  <TwitterShareButton
                    url={`https://circles.spect.network/`}
                    title={
                      "I just filled out a web3 enabled form and claimed my Kudos on @JoinSpect via @mintkudosXYZ 🎉"
                    }
                  >
                    <Box
                      width={{
                        xs: "full",
                        md: "72",
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
                  <Box
                    width={{
                      xs: "full",
                      md: "72",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      icon={<img src="/openseaLogo.svg" alt="src" />}
                      onClick={() => {
                        window.open(
                          `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${kudos.tokenId}`,
                          "_blank"
                        );
                      }}
                    >
                      <Text>View on Opensea</Text>
                    </PrimaryButton>
                  </Box>
                  <Box
                    width={{
                      xs: "full",
                      md: "72",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      icon={<img src="/raribleLogo.svg" alt="src" />}
                      onClick={() => {
                        window.open(
                          `https://rarible.com/token/polygon/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6:${kudos.tokenId}?tab=overview`,
                          "_blank"
                        );
                      }}
                    >
                      {" "}
                      <Text>View on Rarible</Text>
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Box>
            </Box>
          ) : (
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
              {form.formMetadata.canClaimKudos && (
                <Stack direction="horizontal" align="flex-start">
                  <Box>
                    <Text variant="extraLarge" weight="bold">
                      👉
                    </Text>
                  </Box>
                  <Stack>
                    <Text weight="semiBold" variant="large">
                      You are eligible to receive a soulbound token for
                      submitting a response 🎉
                    </Text>
                    <Box
                      width={{
                        xs: "48",
                        md: "72",
                      }}
                    >
                      <PrimaryButton
                        loading={claiming}
                        onClick={async () => {
                          setClaiming(true);
                          try {
                            const res = await fetch(
                              `${process.env.API_HOST}/collection/v1/${form?.id}/airdropKudos`,
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
                              setClaimed(true);
                              setClaimedJustNow(true);
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
                        Claim SBT
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
              {form.formMetadata.walletConnectionRequired && (
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
              )}
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
              <a href="/" target="_blank">
                <PrimaryButton
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Create your own form", {
                        form: form.name,
                        sybilEnabled: form.formMetadata.sybilProtectionEnabled,
                        user: currentUser?.username,
                      });
                  }}
                >
                  Create your own form
                </PrimaryButton>
              </a>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
