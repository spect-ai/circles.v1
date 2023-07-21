import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { grow } from "@/app/common/components/Modal/index";
import { UserType } from "@/app/types";
import { GithubOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Tag, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { smartTrim } from "../../utils/utils";

interface AvatarProps {
  username: string;
  userId: string;
  label: string;
  src: string;
  size: "1" | "1.5" | "2" | "2.5" | "4" | "6" | "8" | "9" | "10" | "12";
  address?: string;
  placeholder?: boolean;
  profile: UserType;
}

interface AvatarGroupProps {
  username: string;
  userId: string;
  label: string;
  src: string;
  size: "1" | "1.5" | "2" | "2.5" | "4" | "6" | "8" | "10" | "12";
  address?: string;
  placeholder?: boolean;
}

export default function ClickableAvatar({
  username,
  userId,
  label,
  src,
  size,
  address,
  placeholder,
  profile,
}: AvatarProps) {
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        position="relative"
      >
        <Avatar
          label={label}
          src={
            src || `https://api.dicebear.com/5.x/thumbs/svg?seed=${profile?.id}`
          }
          size={size}
          address={address}
        />
        <AnimatePresence>
          {hover && (
            <motion.div
              variants={grow}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                position: "absolute",
                top: "1.5rem",
                left: "-0.5rem",
                zIndex: "2",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                borderRadius: "0.5rem",
                boxShadow: `0rem 0.2rem 0.5rem ${
                  mode === "dark" ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.1)"
                }`,
                backgroundColor: `${
                  mode === "dark" ? "rgba(20, 20, 20, 1)" : "white"
                }`,
                width: "24rem",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  margin: "0.5rem 0.5rem 0.5rem",
                  width: "100%",
                }}
              >
                <Box display="flex" flexDirection="row" gap="2" width="3/4">
                  <Avatar
                    label={userId}
                    src={
                      src ||
                      `https://api.dicebear.com/5.x/thumbs/svg?seed=${profile.id}`
                    }
                    size="20"
                    address={address}
                  />
                  <Box>
                    <Text variant="base" weight="semiBold" whiteSpace="nowrap">
                      {username}
                    </Text>

                    {address && (
                      <Tag size="small" tone="accent" hover>
                        {smartTrim(address, 12)}
                      </Tag>
                    )}
                    <InfoBox gap="1">
                      {profile.discordUsername && (
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                          data-tooltip-id="button-tooltip"
                          data-tooltip-content={profile.discordUsername}
                        >
                          <DiscordIcon />
                        </Button>
                      )}
                    </InfoBox>
                    <InfoBox gap="1">
                      {profile?.githubUsername && (
                        <a
                          href={`https://github.com/${profile?.githubUsername}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <GithubOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                    </InfoBox>
                  </Box>
                </Box>
              </Box>
              {
                <Box
                  borderColor="textSecondary"
                  style={{ margin: "0rem 0.5rem 0.5rem" }}
                >
                  <Text variant="label" weight="bold">
                    About Me
                  </Text>
                  {profile.bio && <Text variant="small">{profile.bio}</Text>}
                  {!profile.bio && <Text variant="small"> Not added </Text>}
                </Box>
              }
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
}

export function ClickableAvatarGroup({
  username,
  userId,
  label,
  src,
  size,
  address,
  placeholder,
}: AvatarGroupProps) {
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
        }}
      >
        <Avatar label={label} src={src} size={size} address={address} />
      </Box>
      <AnimatePresence>
        {hover && (
          <motion.div
            variants={grow}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "0rem",
              zIndex: "2",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxWidth: "20rem",
              borderRadius: "0.5rem",
              boxShadow: `0rem 0.2rem 0.5rem ${
                mode === "dark" ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.1)"
              }`,
              backgroundColor: `${
                mode === "dark" ? "rgba(20, 20, 20, 1)" : "white"
              }`,
            }}
          >
            <Avatar label={userId} src={src} size="10" address={address} />
            <Text variant="large" weight="semiBold" whiteSpace="nowrap">
              {username}
            </Text>
            {address && (
              <Tag size="medium" hover>
                {address.substring(0, 5) + "..."}
              </Tag>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const InfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.5rem;
  justify-content: flex-start;
`;
