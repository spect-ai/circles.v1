import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { smartTrim } from "@/app/common/utils/utils";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { UserType } from "@/app/types";
import { Avatar, Box, Input, MediaPicker, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import { useDisconnect } from "wagmi";

const ProfileButton = styled(Box)`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgb(255, 255, 255, 0.1);
  }
`;

export default function ProfileModal() {
  const { disconnect } = useDisconnect();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");

  const { updateProfile } = useProfileUpdate();

  const handleClose = () => {
    void updateProfile({
      username,
      avatar,
    });
    setIsOpen(false);
  };

  const uploadFile = async (file: File) => {
    console.log({ file });
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file, "avatar");
      console.log({ imageGatewayURL });
      setAvatar(imageGatewayURL);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAvatar(currentUser?.avatar || "");
      setUsername(currentUser?.username || "");
    }
  }, [isOpen]);

  return (
    <>
      <Box borderTopWidth="0.375" paddingY="2" paddingX="2">
        <ProfileButton
          onClick={() => setIsOpen(true)}
          data-tour="profile-header-button"
          padding="1"
          borderRadius="large"
          width="full"
        >
          <Stack direction="horizontal">
            <Avatar
              src={currentUser?.avatar}
              placeholder={!currentUser?.avatar}
              label={currentUser?.username || ""}
              size="10"
            />
            <Stack space="1">
              <Text>{currentUser?.username}</Text>
              <Text size="small" variant="label">
                {smartTrim(currentUser?.ethAddress as string, 12)}
              </Text>
            </Stack>
          </Stack>
        </ProfileButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Profile" handleClose={handleClose}>
            <Box padding="8">
              <Stack>
                <Text variant="label">Profile Picture</Text>
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
                  maxSize={10}
                />
                <Text variant="label">Username</Text>
                <Input
                  label=""
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {/* <Button
            size="small"
            variant="secondary"
            width="full"
            onClick={() => {
              router.push(
                `https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
                  process.env.DEV_ENV === "local"
                    ? "http%3A%2F%2Flocalhost%3A3000%2F"
                    : "https%3A%2F%2Ftribes.spect.network%2F"
                }&response_type=code&scope=identify`
              );
            }}
          >
            <Text>
              {user?.attributes.discordId
                ? "Discord Connected"
                : "Link Discord"}
            </Text>
          </Button> */}
                <Box marginTop="2" />
                {!currentUser?.discordId && (
                  <Link
                    href={`https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
                      process.env.NODE_ENV === "development"
                        ? "http%3A%2F%2Flocalhost%3A3000%2F"
                        : "https%3A%2F%2Fdev.spect.network%2F"
                    }&response_type=code&scope=identify`}
                  >
                    <PrimaryButton tourId="connect-discord-button">
                      Connect Discord
                    </PrimaryButton>
                  </Link>
                )}
                {currentUser?.discordId && (
                  <PrimaryButton tourId="connect-discord-button">
                    Discord Connected
                  </PrimaryButton>
                )}
                <PrimaryButton
                  variant="tertiary"
                  onClick={async () => {
                    await fetch(`${process.env.API_HOST}/auth/disconnect`, {
                      method: "POST",
                      credentials: "include",
                    });
                    disconnect();
                    queryClient.setQueryData("getMyUser", null);
                    void queryClient.invalidateQueries("getMyUser");
                    console.log("disconnected");
                    localStorage.removeItem("connectorIndex");
                    setIsOpen(false);
                  }}
                >
                  Logout
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
