import { PassportStampIcons } from "@/app/assets";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { logError } from "@/app/common/utils/utils";
import { getForm } from "@/app/services/Collection";
import { getPoap } from "@/app/services/Poap";
import { CollectionType, POAPEventType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Box, Spinner, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { TwitterShareButton } from "react-share";
import { toast } from "react-toastify";

type Props = {
  form: CollectionType;
  setForm: (form: CollectionType) => void;
  setClaimedJustNow: (value: boolean) => void;
  preview?: boolean;
};

export default function CollectPoap({
  form,
  setForm,
  setClaimedJustNow,
  preview,
}: Props) {
  const [poap, setPoap] = useState({} as POAPEventType);
  const [poapClaimed, setPoapClaimed] = useState(false);
  const [canClaimPoap, setCanClaimPoap] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.formMetadata.poapEventId) {
      setCanClaimPoap(form.formMetadata.canClaimPoap);
      void (async () => {
        setLoading(true);
        const res = await getPoap(
          form.formMetadata.poapEventId?.toString() || ""
        );
        setLoading(false);
        setPoap(res);
        setPoapClaimed(res.claimed);
      })();
    }
  }, [form]);

  if (!form.formMetadata.poapEventId) return null;

  if (loading) {
    return (
      <Stack align="center">
        <Spinner size="large" />
      </Stack>
    );
  }

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
      {poap?.image_url &&
        (poapClaimed ||
          (form.formMetadata.poapEventId && canClaimPoap) ||
          preview) && (
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
                  "Gm! I just filled out a web3 form and claimed a POAP on @JoinSpect!\n\nCheck it out 👉"
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
          {form.formMetadata.poapEventId && !poapClaimed && canClaimPoap && (
            <Stack direction="horizontal" align="flex-start">
              <Box>
                {" "}
                <Text variant="extraLarge" weight="bold">
                  👉
                </Text>
              </Box>
              <Stack>
                <Text weight="semiBold" variant="large">
                  You are eligible to receive a POAP for submitting a response
                  🏅
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
                            }
                          )
                        ).json();

                        const formRes = await getForm(form.slug as string);
                        if (formRes.id) {
                          setForm(formRes);
                        } else logError("Error fetching form");

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
                            logError(
                              "Something went wrong in claiming POAP, please try again later"
                            );
                        }
                      } catch (e: any) {
                        logError(
                          "Something went wrong in claiming POAP, please try again later"
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
          {(form.formMetadata.matchCountForPoap ||
            form.formMetadata.matchCountForPoap === 0) &&
            form.formMetadata.minimumNumberOfAnswersThatNeedToMatchForPoap &&
            form.formMetadata.matchCountForPoap <
              form.formMetadata
                .minimumNumberOfAnswersThatNeedToMatchForPoap && (
              <Stack direction="horizontal" align="flex-start">
                <Box>
                  <Text variant="extraLarge" weight="bold">
                    👉
                  </Text>
                </Box>
                <Stack>
                  <Text weight="semiBold" variant="large">
                    You received a score of{" "}
                    {form.formMetadata.matchCountForPoap} out of{" "}
                    {
                      form.formMetadata
                        .minimumNumberOfAnswersThatNeedToMatchForPoap
                    }{" "}
                    and therefore didn't qualify to claim the POAP 🙁
                  </Text>
                </Stack>
              </Stack>
            )}
        </Box>
      )}
    </Box>
  );
}

const CircularStyledImage = styled.img`
  @media (max-width: 768px) {
    width: 18rem;
  }
  width: 24rem;
  border-radius: 20rem;
`;
