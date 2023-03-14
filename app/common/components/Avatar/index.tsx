import { Avatar, Box, Stack, Tag, Text, useTheme } from "degen";
import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "../PrimaryButton";
import { AnimatePresence, motion } from "framer-motion";
import { grow } from "@/app/common/components/Modal/index";
import { UserType } from "@/app/types";
import { smartTrim } from "../../utils/utils";
import { BsArrowUpRight, BsArrowUpRightSquare } from "react-icons/bs";
import styled from "styled-components";
import {
  BehanceOutlined,
  GithubOutlined,
  LinkOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

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
        <Avatar label={label} src={src} size={size} address={address} />
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
                    src={src}
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
                      {profile?.githubId && !profile?.github && (
                        <a
                          href={`https://github.com/${user?.githubId}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <GithubOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                      {profile?.github && (
                        <a
                          href={`${profile.github}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <GithubOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                      {profile?.twitterId && !profile?.twitter && (
                        <a
                          href={`https://twitter.com/${profile?.twitterId}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <TwitterOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                      {profile?.twitter && (
                        <a
                          href={`${profile.twitter}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <TwitterOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                      {profile?.behance && (
                        <a
                          href={`${profile.behance}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <BehanceOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                      {profile?.website && (
                        <a
                          href={`${profile.website}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <LinkOutlined
                            style={{ color: "grey", fontSize: "1.2rem" }}
                          />
                        </a>
                      )}
                    </InfoBox>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                >
                  <a href={`/profile/${username}`} target="_blank">
                    <PrimaryButton variant="transparent">
                      <Stack direction="horizontal" space="1" align="center">
                        View <BsArrowUpRight />
                      </Stack>
                    </PrimaryButton>
                  </a>
                </Box>
              </Box>
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
              <Box
                borderColor="textSecondary"
                style={{ margin: "0rem 0.5rem 0.5rem" }}
              >
                <Text variant="label" weight="bold">
                  Skills
                </Text>
                <InfoBox>
                  {profile?.skillsV2
                    ?.slice(0, 10)
                    .map((skill: any, index: any) => (
                      <SkillTag mode={mode} as="span" key={index}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text variant="small">{skill.title}</Text>
                        </Box>
                      </SkillTag>
                    ))}
                </InfoBox>
                {!profile?.skillsV2?.length && (
                  <Text variant="small"> Not added </Text>
                )}
              </Box>
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
            <Link href={`/profile/${username}`}>
              <PrimaryButton>View</PrimaryButton>
            </Link>
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

export const SkillTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 0.5rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

const InfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.5rem;
  justify-content: flex-start;
`;
