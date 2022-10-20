/* eslint-disable @next/next/no-img-element */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { FormType, KudosType } from "@/app/types";
import { authStatusAtom } from "@/pages/_app";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Text } from "degen";
import { useAtom } from "jotai";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import { useDisconnect } from "wagmi";

type Props = {
  form: FormType;
  kudos: KudosType;
  setSubmitAnotherResponse: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  setUpdateResponse: (val: boolean) => void;
};

export default function FormResponse({
  form,
  kudos,
  setSubmitAnotherResponse,
  setSubmitted,
  setUpdateResponse,
}: Props) {
  const { width, height } = useWindowSize();
  const { disconnect } = useDisconnect();
  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);
  const { connectedUser, disconnectUser } = useGlobal();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedJustNow, setClaimedJustNow] = useState(false);

  return (
    <Box>
      {claimedJustNow && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          gravity={0.07}
          numberOfPieces={600}
        />
      )}
      {/* <Box>
          {connectedUser && (
            <button
              className="px-8 py-3 rounded-xl text-md text-purple text-bold bg-purple bg-opacity-5 hover:bg-opacity-25 duration-700"
              onClick={async () => {
                await fetch(`${process.env.API_HOST}/auth/disconnect`, {
                  method: "POST",
                  credentials: "include",
                });
                disconnect();
                localStorage.removeItem("connectorIndex");
                setAuthenticationStatus("unauthenticated");
                disconnectUser();
              }}
            >
              Logout
            </button>
          )}
      </Box> */}
      <Stack>
        <Heading>{`${
          form?.messageOnSubmission || "Your response has been submitted!"
        }`}</Heading>
        <Box>
          {kudos?.imageUrl && (
            <img
              src={`${kudos.imageUrl}`}
              alt="kudos"
              className="max-w-sm h-auto ease-in-out duration-300 mb-8"
            />
          )}
          {claimed ? (
            <Box>
              <Heading>You have claimed this Kudos 🎉</Heading>
              <Box>
                <Box>
                  <TwitterShareButton
                    url={`https://spect.network/`}
                    title={
                      "I just filled out a web3 native form and claimed my Kudos on @JoinSpect via @mintkudosXYZ 🎉"
                    }
                  >
                    <PrimaryButton>
                      <TwitterOutlined
                        style={{
                          fontSize: "1.8rem",
                          marginRight: "0.2rem",
                          color: "rgb(29, 155, 240, 1)",
                        }}
                      />
                      <Text>Share on Twitter</Text>
                    </PrimaryButton>
                  </TwitterShareButton>
                </Box>
                <Box>
                  <PrimaryButton
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${kudos.tokenId}`,
                        "_blank"
                      );
                    }}
                  >
                    <img src="/openseaLogo.svg" alt="src" />
                    <Text>View on Opensea</Text>
                  </PrimaryButton>
                </Box>
                <Box>
                  <PrimaryButton
                    onClick={() => {
                      window.open(
                        `https://rarible.com/token/polygon/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6:${kudos.tokenId}?tab=overview`,
                        "_blank"
                      );
                    }}
                  >
                    {" "}
                    <img src="/raribleLogo.svg" alt="src" />
                    <Text>View on Rarible</Text>
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              {form.mintkudosTokenId && (
                <Box>
                  <Heading>
                    The creator of this form is distributing kudos to everyone
                    that submitted a response 🎉
                  </Heading>
                  <Box>
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
                      Claim Kudos
                    </PrimaryButton>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Stack>
          {form?.updatingResponseAllowed && (
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
          {form?.multipleResponsesAllowed && (
            <PrimaryButton
              variant="transparent"
              onClick={() => {
                setSubmitAnotherResponse(true);
              }}
            >
              Submit another response
            </PrimaryButton>
          )}
          <a href="https://circles.spect.network/">
            <PrimaryButton onClick={() => {}}>
              Create your own form
            </PrimaryButton>
          </a>
        </Stack>
      </Stack>
    </Box>
  );
}
