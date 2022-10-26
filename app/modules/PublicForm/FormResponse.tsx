/* eslint-disable @next/next/no-img-element */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FormType, KudosType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Text } from "degen";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import styled from "styled-components";

type Props = {
  form: FormType;
  kudos: KudosType;
  setSubmitAnotherResponse: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  setUpdateResponse: (val: boolean) => void;
};

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 12rem;
  }
  width: 24rem;
`;

export default function FormResponse({
  form,
  kudos,
  setSubmitAnotherResponse,
  setSubmitted,
  setUpdateResponse,
}: Props) {
  const { width, height } = useWindowSize();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(form.kudosClaimedByUser);
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
      <Stack>
        <Heading>{`${
          form?.messageOnSubmission || "Your response has been submitted!"
        }`}</Heading>
        <Box>
          {kudos?.imageUrl && (
            <StyledImage src={`${kudos.imageUrl}`} alt="kudos" />
          )}
          {claimed ? (
            <Stack>
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
                <Stack
                  direction={{
                    xs: "vertical",
                    md: "horizontal",
                  }}
                >
                  <Box
                    width={{
                      xs: "full",
                      md: "1/3",
                    }}
                  >
                    <PrimaryButton
                      variant="tertiary"
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
                      md: "1/3",
                    }}
                  >
                    <PrimaryButton
                      variant="tertiary"
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
            </Stack>
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
