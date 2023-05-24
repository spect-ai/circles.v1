import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";
import { UserType } from "@/app/types";
import { GithubOutlined } from "@ant-design/icons";
import { Box, Button, Input, MediaPicker, Stack, Text } from "degen";
import Link from "next/link";
import router from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useProfile } from "./LocalProfileContext";

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
    usernameError,
    setUsernameError,
  } = useProfile();
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  useEffect(() => {
    if (username.length === 0) {
      setUsernameError("Username cannot be empty");
    } else if (username.length > 15) {
      setUsernameError("Username cannot be longer than 15 characters");
    } else if (
      specialChars.test(username) ||
      username.includes("~") ||
      username.includes("`")
    ) {
      setUsernameError("Username cannot have special characters");
    } else setUsernameError("");
  }, [username]);

  return (
    <Stack space="4">
      <Stack space="1">
        <Box marginLeft="4">
          <Text size="small" weight="semiBold" color="textSecondary">
            Profile Picture
          </Text>
        </Box>
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
      </Stack>
      <Stack space="1">
        <Input
          label="Username"
          placeholder="Username"
          value={username}
          maxLength={15}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsDirty(true);
          }}
          required
        />
        {usernameError && (
          <Text color="red" variant="small">
            {usernameError}
          </Text>
        )}
      </Stack>
      <Stack space="1">
        <Input
          label="Ethereum Address"
          placeholder={currentUser?.ethAddress}
          value={""}
          disabled
        />
      </Stack>
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
      >
        <ConnectDiscordButton state={router.asPath} width="full" />
        {!currentUser?.githubId && (
          <Link
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}`}
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
