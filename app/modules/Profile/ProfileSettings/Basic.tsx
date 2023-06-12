import { isEmail } from "@/app/common/utils/utils";
import { UserType } from "@/app/types";
import { Box, Input, MediaPicker, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DiscordField from "../../PublicForm/Fields/DiscordField";
import GithubField from "../../PublicForm/Fields/GithubField";
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
    setEmail,
    email,
    verifiedSocials,
    setVerifiedSocials,
  } = useProfile();
  useEffect(() => {
    if (username.length === 0) {
      setUsernameError("Username cannot be empty");
    } else if (username.length > 15) {
      setUsernameError("Username cannot be longer than 15 characters");
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
      <Stack>
        <Input
          label="Email"
          placeholder="Email"
          inputMode="email"
          type="email"
          error={email && !isEmail(email)}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsDirty(true);
          }}
        />
      </Stack>
      <Stack space="0">
        <Box marginLeft="4">
          <Text size="small" weight="semiBold" color="textSecondary">
            Connect Accounts
          </Text>
        </Box>
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
        >
          <DiscordField
            data={verifiedSocials}
            setData={setVerifiedSocials}
            propertyId="discord"
            updateRequiredFieldNotSet={() => {}}
            verify={true}
            showAvatar={true}
            showDisconnect={true}
          />
          <GithubField
            data={verifiedSocials}
            setData={setVerifiedSocials}
            propertyId="github"
            updateRequiredFieldNotSet={() => {}}
            showAvatar={true}
            verify={true}
            showDisconnect={true}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
