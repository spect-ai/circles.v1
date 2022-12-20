import { UserType } from "@/app/types";
import { GithubOutlined } from "@ant-design/icons";
import { Box, Input, MediaPicker, Stack, Text, Button } from "degen";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { isEmail } from "@/app/common/utils/utils";
import { useProfile } from "./LocalProfileContext";
import router from "next/router";

export function BasicInfo() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const {
    setIsDirty,
    setAvatar,
    setUsername,
    loading,
    avatar,
    uploading,
    username,
    uploadFile,
  } = useProfile();

  return (
    <Stack>
      <Text variant="label">Profile Picture</Text>
      {!loading && (
        <MediaPicker
          compact
          defaultValue={{
            type: "image/png",
            url: avatar,
          }}
          label="Choose or drag and drop media"
          uploaded={!!avatar}
          onChange={uploadFile}
          uploading={uploading}
          onReset={() => {
            setAvatar("");
            setIsDirty(true);
          }}
          maxSize={10}
        />
      )}
      <Text variant="label">Username</Text>
      <Input
        label
        hideLabel
        placeholder="Username"
        value={username}
        maxLength={15}
        onChange={(e) => {
          setUsername(e.target.value);
          setIsDirty(true);
        }}
        required
      />
      <Text variant="label">ETH Address</Text>
      <Input
        label
        hideLabel
        placeholder={currentUser?.ethAddress}
        value={""}
        disabled
      />
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
      >
        {!currentUser?.discordUsername && (
          <Link
            href={`https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
              process.env.NODE_ENV === "development"
                ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
                : "https%3A%2F%2Fcircles.spect.network%2FlinkDiscord"
            }&response_type=code&scope=guilds%20identify&state=${router.asPath}`}
          >
            <Button
              data-tour="connect-discord-button"
              width="full"
              size="small"
              variant="secondary"
              prefix={
                <Box marginTop="1">
                  <DiscordIcon />
                </Box>
              }
            >
              Connect Discord
            </Button>
          </Link>
        )}
        {currentUser?.discordUsername && (
          <Button
            disabled
            width="full"
            size="small"
            prefix={
              <Box marginTop="1">
                <DiscordIcon />
              </Box>
            }
          >
            Discord Connected
          </Button>
        )}
        {!currentUser?.githubId && (
          <Link
            href={`https://github.com/login/oauth/authorize?client_id=4403e769e4d52b24eeab`}
          >
            <Button
              data-tour="connect-github-button"
              width="full"
              size="small"
              variant="secondary"
              prefix={
                <GithubOutlined
                  style={{
                    fontSize: "1.3rem",
                  }}
                />
              }
            >
              Connect Github
            </Button>
          </Link>
        )}
        {currentUser?.githubId && (
          <Button
            disabled
            width="full"
            size="small"
            prefix={
              <GithubOutlined
                style={{
                  fontSize: "1.3rem",
                }}
              />
            }
          >
            Github Connected
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
