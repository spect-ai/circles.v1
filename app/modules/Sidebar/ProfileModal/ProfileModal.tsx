import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { MemberDetails, UserType } from "@/app/types";
import { GithubOutlined, SaveFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  IconMoon,
  IconSun,
  Input,
  MediaPicker,
  Stack,
  Text,
  useTheme,
} from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDisconnect } from "wagmi";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProfileModal({ setIsOpen }: Props) {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { refetch: fetchMemberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const { disconnectUser } = useGlobal();
  const { disconnect } = useDisconnect();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  const { updateProfile } = useProfileUpdate();

  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mode, setMode } = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const uploadFile = async (file: File) => {
    setIsDirty(true);
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file, "avatar");
      console.log({ imageGatewayURL });
      setAvatar(imageGatewayURL);
      setUploading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setAvatar(currentUser?.avatar || "");
    setUsername(currentUser?.username || "");
    setLoading(false);
  }, []);

  return (
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
              onReset={() => {
                setAvatar("");
                setIsDirty(true);
              }}
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
          <Stack direction="horizontal">
            <Button
              shape="circle"
              variant={mode === "dark" ? "secondary" : "transparent"}
              onClick={() => {
                localStorage.removeItem("lightMode");
                setMode("dark");
              }}
            >
              <IconMoon />
            </Button>
            <Button
              shape="circle"
              variant={mode === "light" ? "secondary" : "transparent"}
              onClick={() => {
                localStorage.setItem("lightMode", "true");
                setMode("light");
              }}
            >
              <IconSun />
            </Button>
          </Stack>

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
          <Link href={`/profile/${currentUser?.id}`}>
            <PrimaryButton>View Full Profile</PrimaryButton>
          </Link>
          {!currentUser?.discordId && (
            <Link
              href={`https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
                process.env.NODE_ENV === "development"
                  ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
                  : "https%3A%2F%2Fcircles.spect.network%2FlinkDiscord"
              }&response_type=code&scope=identify`}
            >
              <PrimaryButton
                tourId="connect-discord-button"
                icon={
                  <Box marginTop="1">
                    <DiscordIcon />
                  </Box>
                }
              >
                Connect Discord
              </PrimaryButton>
            </Link>
          )}
          {currentUser?.discordId && (
            <PrimaryButton
              disabled
              icon={
                <Box marginTop="1">
                  <DiscordIcon />
                </Box>
              }
            >
              Discord Connected
            </PrimaryButton>
          )}
          {!currentUser?.githubId && (
            <Link
              href={`https://github.com/login/oauth/authorize?client_id=4403e769e4d52b24eeab`}
            >
              <PrimaryButton
                tourId="connect-github-button"
                icon={
                  <GithubOutlined
                    style={{
                      fontSize: "1.3rem",
                    }}
                  />
                }
              >
                Connect Github
              </PrimaryButton>
            </Link>
          )}
          {currentUser?.githubId && (
            <PrimaryButton
              disabled
              icon={
                <GithubOutlined
                  style={{
                    fontSize: "1.3rem",
                  }}
                />
              }
            >
              Github Connected
            </PrimaryButton>
          )}
          <PrimaryButton
            variant="transparent"
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
  );
}
