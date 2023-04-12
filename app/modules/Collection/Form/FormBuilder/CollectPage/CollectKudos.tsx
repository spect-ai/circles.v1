import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType, KudosType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import styled from "styled-components";

type Props = {
  form: CollectionType;
  setClaimedJustNow: (claimed: boolean) => void;
  preview?: boolean;
};

const CollectKudos = ({ form, setClaimedJustNow, preview }: Props) => {
  const [kudos, setKudos] = useState({} as KudosType);
  const [claimed, setClaimed] = useState(form.formMetadata.hasClaimedKudos);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    console.log({ form });
    if (form.formMetadata.mintkudosTokenId) {
      void (async () => {
        const kudo = await (
          await fetch(
            `${process.env.MINTKUDOS_HOST}/v1/tokens/${form.formMetadata.mintkudosTokenId}`
          )
        ).json();
        console.log({ kudo });
        setKudos(kudo);
      })();
    }
  }, []);

  if (!form.formMetadata.mintkudosTokenId) return null;

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
    >
      {kudos?.imageUrl &&
        (claimed || form.formMetadata.canClaimKudos || preview) && (
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
          <Box display="flex" flexDirection="row" gap="4" alignItems="center">
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
          {(form.formMetadata.canClaimKudos || preview) && (
            <Stack direction="horizontal" align="flex-start" space="2">
              <Box>
                <Text variant="extraLarge" weight="bold">
                  👉
                </Text>
              </Box>
              <Stack>
                <Text weight="semiBold">
                  You are eligible to receive a soulbound token for submitting a
                  response 🎉
                </Text>
                <Box
                  width={{
                    xs: "full",
                    md: "full",
                  }}
                >
                  <PrimaryButton
                    loading={claiming}
                    onClick={async () => {
                      if (preview) return;
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
          {(form.formMetadata.matchCountForKudos ||
            form.formMetadata.matchCountForKudos === 0) &&
            form.formMetadata
              .minimumNumberOfAnswersThatNeedToMatchForMintkudos &&
            form.formMetadata.matchCountForKudos <
              form.formMetadata
                .minimumNumberOfAnswersThatNeedToMatchForMintkudos && (
              <Stack direction="horizontal" align="flex-start">
                <Box>
                  <Text variant="extraLarge" weight="bold">
                    👉
                  </Text>
                </Box>
                <Stack>
                  <Text weight="semiBold" variant="large">
                    You received a score of{" "}
                    {form.formMetadata.matchCountForKudos} out of{" "}
                    {
                      form.formMetadata
                        .minimumNumberOfAnswersThatNeedToMatchForMintkudos
                    }{" "}
                    and therefore didn't qualify to claim the soulbound token 🙁
                  </Text>
                </Stack>
              </Stack>
            )}
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

export default CollectKudos;
