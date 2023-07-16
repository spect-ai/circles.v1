import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation } from "react-use";
import DiscordProfileInfo from "./DiscordProfileInfo";
import { Button, Logo, Page, Stepper, Tag, Text } from "@avp1598/vibes";

type Props = {
  form: CollectionType;
  data: any;
  setData: (value: any) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  verificationToken: string;
  setVerificationToken: (token: string) => void;
  discordUser: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  setDiscordUser: (user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  }) => void;
  onStepChange: (step: number) => void;
};

const ConnectDiscordPage = ({
  form,
  data,
  setData,
  currentPage,
  setCurrentPage,
  verificationToken,
  setVerificationToken,
  discordUser,
  setDiscordUser,
  onStepChange,
}: Props) => {
  const { hostname } = useLocation();
  const [code, setCode] = useState("");
  const pageNumber = form.formMetadata.pageOrder.indexOf(currentPage);

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
        `${process.env.API_HOST}/collection/v1/${form.id}/verifyAccess?code=${code}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        const { userData, verificationToken } = await res.json();
        console.log({ userData, verificationToken });
        if (userData.id) {
          setDiscordUser(userData);
          for (const field of form.propertyOrder) {
            if (form.properties[field].type === "discord") {
              setData({
                ...data,
                [field]: userData,
              });
            }
          }
        }
        if (verificationToken) {
          setVerificationToken(verificationToken);
        }
      }
    })();
  }, [code]);

  return (
    <Page>
      <Box
        style={{
          minHeight: "calc(100vh - 20rem)",
          width: "100%",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        overflow="auto"
      >
        <Box>
          <Box marginBottom="8">
            <Stepper
              steps={form.formMetadata.pageOrder.length}
              currentStep={form.formMetadata.pageOrder.indexOf(
                currentPage || ""
              )}
              onStepChange={onStepChange}
            />
          </Box>

          {discordUser?.id ? (
            <Stack align="center">
              <Box width="80">
                <DiscordProfileInfo {...discordUser} />
              </Box>
            </Stack>
          ) : (
            <Stack space="2">
              {form.formMetadata.logo && <Logo src={form.formMetadata.logo} />}
              {/* <NameInput autoFocus value={form.name} disabled /> */}
              <Text type="heading" color="secondary">
                {form.name}
              </Text>
              {form.description && (
                <Text type="description" description={form.description} />
              )}
            </Stack>
          )}
        </Box>

        <motion.div
          className="box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            padding="4"
            marginTop="4"
            gap="4"
          >
            {discordUser?.id && verificationToken ? (
              <Stack direction="horizontal" space="1" wrap>
                <Text weight="bold">
                  You have the required role on Discord to access this form!
                  Click Continue.
                </Text>
              </Stack>
            ) : discordUser?.id ? (
              <Stack direction="horizontal" space="1" wrap>
                <Text weight="bold">
                  You dont have the required roles to access this form.
                </Text>
              </Stack>
            ) : (
              <>
                {" "}
                <Stack direction="horizontal" space="1" wrap>
                  <Text weight="bold">
                    You require one of the following roles on Discord to access
                    this form. Connect Discord to verify your role.
                  </Text>
                </Stack>
                <Stack space="2">
                  {form.formMetadata.discordRoleGating?.map(
                    (role: { id: string; name: string }) => (
                      <Box key={role.id} width="fit">
                        <Tag>{role.name}</Tag>
                      </Box>
                    )
                  )}
                </Stack>
              </>
            )}
          </Box>
        </motion.div>

        <Stack direction="horizontal" justify="space-between">
          <Box
            paddingX="5"
            paddingBottom="4"
            width={{
              xs: "40",
              md: "56",
            }}
          >
            <Button
              variant="tertiary"
              onClick={() => {
                setCurrentPage(form.formMetadata.pageOrder[pageNumber - 1]);
              }}
            >
              Back
            </Button>
          </Box>
          <Box
            paddingX="5"
            paddingBottom="4"
            width={{
              xs: "40",
              md: "64",
            }}
          >
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
            >
              <Box width="full">
                {discordUser?.id ? (
                  <Button
                    onClick={() => {
                      if (
                        form.formMetadata.discordRoleGating &&
                        !verificationToken
                      ) {
                        toast.error(
                          "You do not have the correct roles to access this form"
                        );
                        return;
                      }
                      setCurrentPage(
                        form.formMetadata.pageOrder[pageNumber + 1]
                      );
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    icon={<FaDiscord size={18} />}
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
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Page>
  );
};

export default ConnectDiscordPage;
