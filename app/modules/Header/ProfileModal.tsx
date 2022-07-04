import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { smartTrim } from "@/app/common/utils/utils";
import { useGlobalContext } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { MemberDetails, UserType } from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Avatar, Box, Input, MediaPicker, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const { disconnectUser } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { circle: cId } = router.query;
  const { refetch: fetchMemberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  const { updateProfile } = useProfileUpdate();

  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const uploadFile = async (file: File) => {
    setIsDirty(true);
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
      setLoading(true);
      setAvatar(currentUser?.avatar || "");
      setUsername(currentUser?.username || "");
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <>
      <Box borderTopWidth="0.375" paddingTop="2" paddingX="2">
        <ProfileButton
          onClick={() => setIsOpen(true)}
          data-tour="profile-header-button"
          padding="1"
          borderRadius="large"
          width="full"
        >
          <Stack direction="horizontal">
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
                    maxSize={10}
                  />
                )}
                <Text variant="label">Username</Text>
                <Input
                  label=""
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsDirty(true);
                  }}
                />
                <Box marginTop="2" />

                <PrimaryButton
                  disabled={!isDirty || uploading || !username}
                  loading={loading}
                  icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
                  onClick={async () => {
                    setLoading(true);
                    await updateProfile({
                      username,
                      avatar,
                    });
                    if (cId) {
                      await fetchMemberDetails();
                    }
                    setLoading(false);
                    handleClose();
                    setIsDirty(false);
                  }}
                >
                  Save Profile
                </PrimaryButton>
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
                    localStorage.removeItem("connectorIndex");
                    disconnectUser();
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
