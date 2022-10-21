import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { UserType } from "@/app/types";
import { GithubOutlined, SaveFilled } from "@ant-design/icons";
import {
  Box,
  Input,
  MediaPicker,
  Stack,
  Text,
  Button,
  Tag,
  Textarea,
} from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { skillsArray } from "./constants";
import { validateEmail } from "@/app/common/utils/utils";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

export default function ProfileModal({ setIsOpen }: Props) {
  const router = useRouter();
  const user = router.query.user;

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([] as string[]);

  const [isDirty, setIsDirty] = useState(false);

  const { updateProfile } = useProfileUpdate();

  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const uploadFile = async (file: File) => {
    setIsDirty(true);
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file);
      console.log({ imageGatewayURL });
      setAvatar(imageGatewayURL);
      setUploading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setAvatar(currentUser?.avatar || "");
    setUsername(currentUser?.username || "");
    setBio(currentUser?.bio || "");
    setSkills(currentUser?.skills || []);
    setEmail(currentUser?.email || "");
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title="Profile" handleClose={handleClose} zIndex={2}>
      <Box padding="6">
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
          <Stack direction="horizontal" justify="space-between">
            <Text variant="label">Bio</Text>
            <Tag>{100 - bio.length}</Tag>
          </Stack>
          <Textarea
            label
            hideLabel
            maxLength={100}
            rows={2}
            placeholder="About you under 100 characters"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              setIsDirty(true);
            }}
          />
          <Text variant="label">Email</Text>
          <Input
            label
            hideLabel
            placeholder="Email"
            inputMode="email"
            type="email"
            error={email && !validateEmail(email)}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsDirty(true);
            }}
          />
          <Stack direction="horizontal" justify="space-between">
            <Text variant="label">Skills</Text>
            <Tag>Upto {10 - skills.length}</Tag>
          </Stack>
          <Box
            display="flex"
            flexDirection="row"
            gap="1.5"
            flexWrap="wrap"
            marginBottom="2"
            justifyContent="center"
          >
            {skillsArray.map((skill) => (
              <Box
                onClick={() => {
                  if (skills.includes(skill)) {
                    setSkills(skills.filter((item) => item !== skill));
                  } else if (skills.length < 10) {
                    setSkills([...skills, skill]);
                  }
                  setIsDirty(true);
                }}
                style={{
                  cursor: "pointer",
                }}
                key={skill}
              >
                <Tag
                  size="medium"
                  hover
                  tone={skills.includes(skill) ? "accent" : "secondary"}
                >
                  <Box display="flex" alignItems="center">
                    {skill}
                  </Box>
                </Tag>
              </Box>
            ))}
          </Box>
          <PrimaryButton
            disabled={!isDirty || uploading || !username}
            loading={loading}
            icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
            onClick={async () => {
              setLoading(true);
              const res = await updateProfile({
                username,
                avatar,
                bio,
                skills,
                email,
              });
              console.log(res);
              setLoading(false);
              handleClose();
              setIsDirty(false);
              if (user !== username && user !== undefined) {
                void router.push(`/profile/${username}`);
              }
            }}
          >
            Save Profile
          </PrimaryButton>
          <Stack direction="horizontal">
            {!currentUser?.discordId && (
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
                  process.env.NODE_ENV === "development"
                    ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
                    : "https%3A%2F%2Fcircles.spect.network%2FlinkDiscord"
                }&response_type=code&scope=identify`}
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
            {currentUser?.discordId && (
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
      </Box>
    </Modal>
  );
}
