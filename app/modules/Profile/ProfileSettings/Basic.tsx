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
import { useLocation } from "react-use";
import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";

export function BasicInfo() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { hostname } = useLocation();

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
        <ConnectDiscordButton state={router.asPath} width="full" />
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
