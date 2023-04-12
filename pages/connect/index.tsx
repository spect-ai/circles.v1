import PrimaryButton from "@/app/common/components/PrimaryButton";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import DiscordField from "@/app/modules/PublicForm/Fields/DiscordField";
import GithubField from "@/app/modules/PublicForm/Fields/GithubField";
import TelegramField from "@/app/modules/PublicForm/Fields/TelegramField";
import { Connect } from "@/app/modules/Sidebar/ProfileButton/ConnectButton";
import { postSocials, PostSocialsPayload } from "@/app/services/Collection";
import { Avatar, Box, Text } from "degen";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ConnectPage: NextPage = () => {
  const profileContext = useProviderLocalProfile();
  const router = useRouter();
  const { query } = router;
  const [data, setData] = useState<any>({});
  const [backToDiscordMessage, setBackToDiscordMessage] = useState("");

  useEffect(() => {
    if (query.discord && profileContext.discordId?.length) {
      setData((d: any) => ({
        ...d,
        discord: {
          id: profileContext.discordId,
          username: profileContext.discordUsername,
        },
      }));
    }
    if (query.telegram && profileContext.telegramId?.length) {
      setData((d: any) => ({
        ...d,
        telegram: {
          id: profileContext.telegramId,
          username: profileContext.telegramUsername,
        },
      }));
    }
    if (query.github && profileContext.githubId?.length) {
      setData((d: any) => ({
        ...d,
        github: {
          id: profileContext.githubId,
          username: profileContext.githubUsername,
        },
      }));
    }
  }, [
    profileContext.discordId,
    profileContext.telegramId,
    profileContext.githubId,
  ]);

  useEffect(() => {
    const hasAllConnections =
      Object.keys(query).length > 0 &&
      Object.keys(query)
        .filter((key) => ["discord", "github", "telegram"].includes(key))
        .every((key) => {
          return data[key] && data[key] !== "undefined";
        }) &&
      (!query.wallet || profileContext);
    if (hasAllConnections) {
      const payload = {} as PostSocialsPayload;
      if (data["discord"]) {
        payload.discordId = data["discord"].id;
        payload.discord = {
          username: data["discord"].username,
          id: data["discord"].id,
        };
      }
      if (data["telegram"]) {
        payload.telegram = {
          id: data["telegram"].id,
          username: data["telegram"].username,
          first_name: data["telegram"].first_name,
        };
      }
      if (data["github"]) {
        payload.github = {
          id: data["github"].id,
          username: data["github"].login,
          name: data["github"].name,
        };
      }
      setBackToDiscordMessage("Linking your socials...");
      postSocials(query.channelId as string, payload)
        .then((res) => {
          console.log({ res });
          if (res.success) {
            setBackToDiscordMessage(
              "🎊 Your socials are successfully linked! You can now close this window and go back to Discord."
            );
          }
        })
        .catch((err) => {
          console.log({ err });
          setBackToDiscordMessage(
            "🤔 Something went wrong. Please contact support."
          );
        });
    }
  }, [data]);

  return (
    <>
      <MetaHead
        title={"Spect Connections"}
        description={
          "Connect Discord, Telegram, Github & wallet to your profile & use web3 from web2 platforms."
        }
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <LocalProfileContext.Provider value={profileContext}>
        <DesktopContainer
          backgroundColor="backgroundSecondary"
          id="public-layout"
        >
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection="column"
              overflow="hidden"
              justifyContent="center"
              alignItems="flex-start"
              padding="4"
              gap="2"
            >
              <Avatar
                src="https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
                label=""
                size="16"
              />
              {query.wallet &&
                query.discord &&
                !query.telegram &&
                !query.github && (
                  <Box
                    width={{
                      xs: "full",
                      lg: "96",
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    gap="4"
                  >
                    <Text variant="large" weight="bold">
                      Sign in & connect Discord to
                    </Text>
                    <Text>😀 Prove that you're human</Text>
                    <Text>
                      🤝 Prove that you have roles on Guild.xyz to respond to
                      role gated forms
                    </Text>
                    <Text>
                      💰 Receive NFTs & ERC-20s for filling out forms on Discord
                    </Text>
                    <Text>
                      🙌 Show off your NFTs & ERC-20s in form responses
                    </Text>
                  </Box>
                )}
              {query.telegram &&
                query.discord &&
                !query.github &&
                !query.wallet && (
                  <Box
                    width={{
                      xs: "full",
                      lg: "96",
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    gap="4"
                  >
                    <Text variant="large" weight="bold">
                      Connect your Telegram account to continue
                    </Text>
                  </Box>
                )}
              {query.github &&
                query.discord &&
                !query.telegram &&
                !query.wallet && (
                  <Box
                    width={{
                      xs: "full",
                      lg: "96",
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    gap="4"
                  >
                    <Text variant="large" weight="bold">
                      Connect your Github account to continue
                    </Text>
                  </Box>
                )}
              {query.wallet === "true" && (
                <Box marginTop="4" width="64">
                  <Connect variant="tertiary" text="Sign In" />
                </Box>
              )}
              {query.discord === "true" && (
                <DiscordField
                  data={data}
                  setData={setData}
                  propertyName="discord"
                  updateRequiredFieldNotSet={() => {}}
                />
              )}
              {query.telegram === "true" && (
                <TelegramField
                  data={data}
                  setData={setData}
                  propertyName="telegram"
                  updateRequiredFieldNotSet={() => {}}
                />
              )}
              {query.github === "true" && (
                <GithubField
                  data={data}
                  setData={setData}
                  propertyName="github"
                  updateRequiredFieldNotSet={() => {}}
                />
              )}
              <Box marginTop="4" padding="2">
                {" "}
                <Text variant="base" weight="bold">
                  {backToDiscordMessage}
                </Text>
              </Box>
            </Box>
          </Box>
        </DesktopContainer>
      </LocalProfileContext.Provider>
    </>
  );
};

export default React.memo(ConnectPage);

const DesktopContainer = styled(Box)`
  display: flex;
  flexdirection: row;
  height: 100vh;
  overflowy: auto;
  overflowx: hidden;
`;
