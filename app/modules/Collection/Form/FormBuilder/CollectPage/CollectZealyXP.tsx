import { logError } from "@/app/common/utils/utils";
import { getUser } from "@/app/modules/PublicForm/FormFields";
import { CollectionType, UserType } from "@/app/types";
import { TwitterOutlined } from "@ant-design/icons";
import { Button, Text } from "@avp1598/vibes";
import { Box, Spinner, Stack } from "degen";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useQuery } from "react-query";
import { TwitterShareButton } from "react-share";
import { useLocation } from "react-use";

type Props = {
  form: CollectionType;
  setClaimedJustNow: (value: boolean) => void;
  preview?: boolean;
};

export default function CollectZealyXp({
  form,
  setClaimedJustNow,
  preview,
}: Props) {
  const { hostname } = useLocation();
  const [zealyXP, setZealyXP] = useState(0);
  const [zealyXPClaimed, setZealyXPClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });
  const [discordUser, setDiscordUser] = useState<{
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  }>({} as any);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (form.formMetadata.zealyXP) {
      void (async () => {
        setLoading(true);
        try {
          setZealyXP(form.formMetadata.canClaimZealy || 0);
          setZealyXPClaimed(form.formMetadata.hasClaimedZealy || false);
          const res = await fetch(
            `${process.env.API_HOST}/collection/v1/${form.id}/canClaimZealyXp`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          console.log({ data });
          if (data.errorCode === "ZEALY_USER_NOT_FOUND") {
            setUserNotFound(true);
          } else {
            setUserNotFound(false);
            setZealyXPClaimed(data.hasClaimedXp);
            setZealyXP(data.canClaimXp);
          }
        } catch (e) {
          logError(e as string);
        }
        setLoading(false);
      })();
    }
  }, [form.formMetadata.zealyXP, discordUser]);

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.code) {
          setCode(event.data.code);
        }
      },
      false
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (!code) return;
      const res = await fetch(
        `${process.env.API_HOST}/user/v1/connectDiscord?code=${code}`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const { userData } = await res.json();
        console.log({ userData });
        if (userData.id) {
          setDiscordUser(userData);
        }
      }
    })();
  }, [code]);

  if (!form.formMetadata.zealyXP || form.formMetadata.zealyXP === 0)
    return null;

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
      {zealyXPClaimed ? (
        <Stack>
          <Text weight="bold">You have claimed some XP on Zealy 😎</Text>
          <Box>
            <Stack direction="vertical">
              <TwitterShareButton
                url={`https://circles.spect.network/`}
                title={`Gm! I just filled out a web3 form and claimed ${form.formMetadata.canClaimZealy} XP on @JoinSpect!\n\nCheck it out 👉`}
              >
                <Box
                  width={{
                    xs: "full",
                    md: "72",
                  }}
                >
                  <Button
                    variant="tertiary"
                    icon={
                      <TwitterOutlined
                        style={{
                          fontSize: "1.1rem",
                        }}
                      />
                    }
                  >
                    <Text>Share on Twitter</Text>
                  </Button>
                </Box>
              </TwitterShareButton>
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
          {zealyXP && !zealyXPClaimed && (
            <Stack direction="horizontal" align="flex-start">
              <Box>
                {" "}
                <Text weight="bold">👉</Text>
              </Box>
              <Stack>
                <Text weight="semiBold">
                  You are eligible to receive {zealyXP} XP for submitting a
                  response 😎
                </Text>
                {userNotFound && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="4"
                    width={{
                      xs: "48",
                      md: "72",
                    }}
                  >
                    <Text type="label">
                      However, your account was not found on Zealy.
                    </Text>
                    {!currentUser?.discordId && !discordUser?.id && (
                      <Box display="flex" flexDirection="column" gap="2">
                        <Text type="label">
                          If your account is linked with Discord, please connect
                          your Discord.
                        </Text>
                        <Button
                          variant="tertiary"
                          icon={<FaDiscord size={24} />}
                          onClick={async () => {
                            const url = `https://discord.com/api/oauth2/authorize?client_id=${
                              process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
                            }&redirect_uri=${
                              process.env.NODE_ENV === "development"
                                ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
                                : `https%3A%2F%2F${hostname}%2FlinkDiscord`
                            }&response_type=code&scope=guilds%20identify`;
                            window.open(url, "popup", "width=600,height=600");
                          }}
                        >
                          Connect Discord
                        </Button>
                      </Box>
                    )}
                    <Box display="flex" flexDirection="column" gap="2">
                      <Text type="label">
                        Or, create a Zealy account to claim XP. Once you create
                        an account, please refresh this page.
                      </Text>
                      <Button
                        variant="tertiary"
                        onClick={() => {
                          window.open(
                            `https://zealy.io/c/${form.formMetadata.zealySubdomain}/questboard`,
                            "_blank",
                            "popup,left=100,top=100,width=750,height=750"
                          );
                        }}
                      >
                        Create Zealy Account
                      </Button>
                    </Box>
                  </Box>
                )}
                {!userNotFound && (
                  <Box
                    width={{
                      xs: "48",
                      md: "72",
                    }}
                  >
                    <Button
                      loading={claiming}
                      onClick={async () => {
                        setClaiming(true);
                        try {
                          const res = await (
                            await fetch(
                              `${process.env.API_HOST}/collection/v1/${form.id}/claimZealyXp`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                              }
                            )
                          ).json();

                          if (res.receiverId) {
                            setZealyXPClaimed(true);
                            setClaimedJustNow(true);
                          } else if (res.statusCode === 500) {
                            logError(
                              "Something went wrong while claim XP, please try again later or reach out to support"
                            );
                          }
                        } catch (e: any) {
                          logError(
                            "Something went wrong while claim XP, please try again later or reach out to support"
                          );
                        }

                        setClaiming(false);
                      }}
                    >
                      Claim XP
                    </Button>
                  </Box>
                )}
              </Stack>
            </Stack>
          )}
        </Box>
      )}

      {form.formMetadata.zealyXP &&
        Object.values(form.formMetadata.zealyXpPerField || {}).some(
          (a) => a > 0
        ) &&
        !form.formMetadata.canClaimZealy &&
        !form.formMetadata.hasClaimedZealy &&
        !userNotFound &&
        !loading && (
          <Stack direction="horizontal" align="flex-start">
            <Box>
              <Text weight="bold">👉</Text>
            </Box>
            <Stack>
              <Text weight="semiBold">
                Unfortunately, you didn't qualify to claim any XP 🙁
              </Text>
            </Stack>
          </Stack>
        )}
    </Box>
  );
}
