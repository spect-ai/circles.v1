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
  const [hasAllConnections, setHasAllConnections] = useState(false);

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
          username: "gm",
        },
      }));
    }
    if (query.github && profileContext.githubId?.length) {
      setData((d: any) => ({
        ...d,
        github: {
          id: profileContext.githubId,
          username: "fg",
        },
      }));
    }
  }, [
    profileContext.discordId,
    profileContext.telegramId,
    profileContext.githubId,
  ]);

  useEffect(() => {
    if (!query) return;
    console.log({ query, data, profileContext });

    if (
      (query.discord === "true" && !data["discord"]) ||
      (query.telegram === "true" && !data["telegram"]) ||
      (query.github === "true" && !data["github"]) ||
      (query.wallet === "true" && !profileContext)
    ) {
      console.log("setting has all connections to false");
      setHasAllConnections(false);
      return;
    }
    setHasAllConnections(true);
  }, [data, profileContext]);

  useEffect(() => {
    console.log({ hasAllConnections });
    if (hasAllConnections) {
      const payload = {} as PostSocialsPayload;
      if (data["discord"]) {
        payload.discordId = data["discord"].id;
        payload.discordUsername = data["discord"].username;
      }
      if (data["telegram"]) {
        payload.telegramId = data["telegram"].id;
        payload.telegramUsername = data["telegram"].username;
      }
      if (data["github"]) {
        payload.githubId = data["github"].id;
        payload.githubUsername = data["github"].username;
      }

      postSocials(query.channelId as string, payload).then((res) =>
        console.log({ res })
      );
    }
  }, [hasAllConnections]);

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
              width="full"
              overflow="hidden"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                src="https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
                label=""
                size="16"
              />
              {query.wallet && query.discord && (
                <Box
                  width="96"
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap="2"
                >
                  <Text variant="large" weight="bold">
                    Sign in to Spect & connect Discord to be able do the
                    follwing.
                  </Text>
                  <Text>😀 Prove that you're human</Text>
                  <Text>
                    🤝 Prove that you have roles on Guild.xyz to respond to role
                    gated forms
                  </Text>
                  <Text>
                    💰 Receive NFTs & ERC-20s for filling out incentivized forms
                    on Discord
                  </Text>
                  <Text>🙌 Show off your NFTs & ERC-20s in form responses</Text>
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
