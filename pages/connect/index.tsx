import Editor from "@/app/common/components/Editor";
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
import { connectedUserAtom } from "@/app/state/global";
import { CollectionType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useAtom } from "jotai";
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
  const [collection, setCollection] = useState<CollectionType>(
    {} as CollectionType
  );

  const [connectedUser] = useAtom(connectedUserAtom);

  useEffect(() => {
    const verifiedSocials = profileContext?.verifiedSocials;
    if (query.discord && verifiedSocials["discord"]?.id?.length) {
      setData((d: any) => ({
        ...d,
        discord: {
          id: verifiedSocials["discord"].id,
          username: verifiedSocials["discord"]?.username,
        },
      }));
    }
    if (query.telegram && verifiedSocials["telegram"]?.id?.length) {
      setData((d: any) => ({
        ...d,
        telegram: {
          id: verifiedSocials["telegram"].id,
          username: verifiedSocials["telegram"]?.username,
        },
      }));
    }
    if (query.github && verifiedSocials["github"]?.id?.length) {
      setData((d: any) => ({
        ...d,
        github: {
          id: verifiedSocials["github"].id,
          username: verifiedSocials["github"]?.username,
        },
      }));
    }
  }, [profileContext.verifiedSocials]);

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
      if (query.wallet) {
        payload.propertyName = "connectWallet";
      } else if (data["telegram"]) {
        payload.telegram = {
          id: data["telegram"].id,
          username: data["telegram"].username,
          first_name: data["telegram"].first_name,
        };
        payload.propertyName = query.propertyId as string;
      } else if (data["github"]) {
        payload.github = {
          id: data["github"].id,
          username: data["github"].login,
          name: data["github"].name,
        };
        payload.propertyName = query.propertyId as string;
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

  useEffect(() => {
    if (query.channelId) {
      fetch(
        `${process.env.API_HOST}/collection/v1/${query.channelId}/collection`
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        })
        .then((data) => {
          setCollection(data);
        });
    }
  }, [query.channelId]);

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
              {collection && collection.formMetadata && collection.parents && (
                <ScrollContainer>
                  <Stack space="2">
                    {collection.formMetadata.logo && (
                      <Avatar
                        src={collection.formMetadata.logo}
                        label=""
                        size="20"
                      />
                    )}
                    <NameInput
                      autoFocus
                      value={collection.name}
                      disabled
                      rows={Math.floor(collection.name?.length / 20) + 1}
                    />
                    {collection.description && (
                      <Editor
                        value={collection.description}
                        isDirty={true}
                        disabled
                        version={collection.editorVersion}
                      />
                    )}
                  </Stack>
                </ScrollContainer>
              )}
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
                      Sign in & connect Discord to continue
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
                      Link your Telegram account to Discord to continue
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
                      Link your Github account to Discord to continue
                    </Text>
                  </Box>
                )}
              {query.wallet === "true" && (
                <Box marginTop="4" width="64">
                  <Connect variant="tertiary" text="Sign In" />
                </Box>
              )}
              {query.wallet === "true" ? (
                <>
                  query.discord === "true" && connectedUser && (
                  <DiscordField
                    data={data}
                    setData={setData}
                    propertyId="discord"
                    updateRequiredFieldNotSet={() => {}}
                    verify
                  />
                </>
              ) : (
                (query.telegram === "true" || query.github === "true") &&
                query.discord === "true" && (
                  <>
                    {" "}
                    <DiscordField
                      data={data}
                      setData={setData}
                      propertyId="discord"
                      updateRequiredFieldNotSet={() => {}}
                      verify={false}
                    />
                  </>
                )
              )}
              {query.telegram === "true" && (
                <TelegramField
                  data={data}
                  setData={setData}
                  propertyId="telegram"
                  updateRequiredFieldNotSet={() => {}}
                />
              )}
              {query.github === "true" && (
                <GithubField
                  data={data}
                  setData={setData}
                  propertyId="github"
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

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  max-height: 25rem;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

export const NameInput = styled.textarea`
  resize: none;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  font-family: Inter;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
  overflow: hidden;
`;
