import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { UserType } from "@/app/types";
import {
  GithubOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { fetchEnsAvatar, fetchEnsName } from "@wagmi/core";
import {
  Avatar,
  Box,
  Button,
  Heading,
  IconBookOpenSolid,
  Stack,
  Tag,
  Text,
} from "degen";
import React, { useEffect, useState } from "react";
import { Hidden } from "react-grid-system";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useCircle } from "../CircleContext";
import { Tooltip } from "react-tippy";
import { Globe } from "react-feather";
import { AnimatePresence } from "framer-motion";
import { Embed } from "../../Collection/Embed";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useRouter } from "next/router";
import { useLocation } from "react-use";

type Props = {};

export default function Membership({}: Props) {
  const { navigationBreadcrumbs, memberDetails, circle } = useCircle();
  const [isEmebedOpen, setIsEmebedOpen] = useState(false);
  const { pathname, hostname } = useLocation();
  const route = pathname?.split("/")[2];
  console.log({ route, pathname });

  return (
    <Box paddingX="8" paddingY="4">
      <AnimatePresence>
        {isEmebedOpen && (
          <Embed
            isOpen={isEmebedOpen}
            setIsOpen={setIsEmebedOpen}
            component="members"
            routeId={circle.slug}
          />
        )}
      </AnimatePresence>
      {route !== "embed" && (
        <Stack
          space="1"
          direction="horizontal"
          align="center"
          justify="space-between"
        >
          <Stack direction="horizontal" space="4" align="center">
            <Heading>Membership Center</Heading>
            <PrimaryButton onClick={() => setIsEmebedOpen(true)}>
              Embed
            </PrimaryButton>
          </Stack>
          <Hidden xs sm>
            <Box>
              {navigationBreadcrumbs && (
                <Breadcrumbs crumbs={navigationBreadcrumbs} />
              )}
            </Box>
          </Hidden>
        </Stack>
      )}
      <Stack align="center">
        {Object.keys(circle.roles).map((role) => {
          const members = Object.keys(circle.memberRoles).filter((id) => {
            return circle.memberRoles[id].find((r) => r === role);
          });
          if (!members.length) return null;
          return (
            <Box>
              <Text variant="label" align="center">
                {role}
              </Text>
              <Stack direction="horizontal" wrap>
                {members.map((id) => {
                  const member = memberDetails?.memberDetails[id];
                  if (!member) return null;
                  return <Member key={id} member={member} />;
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

type MemberProps = {
  member: UserType;
};

const Member = ({ member }: MemberProps) => {
  const [ensAvatar, setEnsAvatar] = useState("");

  useEffect(() => {
    (async () => {
      if (!member.username || member.avatar) return;
      const ensAvatar = await fetchEnsAvatar({
        address: member.ethAddress as `0x${string}`,
        chainId: 1,
      });
      setEnsAvatar(ensAvatar as string);
    })();
  }, [member]);
  return (
    <Box padding="2" margin="1" width="64">
      <Stack space="1" align="center">
        <Box
          style={{
            marginBottom: "-2rem",
            borderRadius: "50%",
          }}
        >
          <Avatar
            src={member.avatar || ensAvatar}
            placeholder={!member.avatar}
            address={member.ethAddress as `0x${string}`}
            label={member.username}
            size="24"
          />
        </Box>
        <Box
          backgroundColor="background"
          padding="4"
          width="full"
          borderRadius="2xLarge"
        >
          <Box marginTop="4" />
          <Stack align="center">
            <Text weight="semiBold">{member.username}</Text>
            <Stack direction="horizontal" wrap space="1">
              {member.skillsV2?.map((skill) => (
                <Stack direction="horizontal" space="2" align="center">
                  <Tag key={skill.title} tone="accent">
                    {skill.title}
                  </Tag>
                  {/* <Text variant="label">|</Text> */}
                </Stack>
              ))}
            </Stack>
            <Stack direction="horizontal" wrap space="1">
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noreferrer">
                  <Button shape="circle" size="small" variant="transparent">
                    <TwitterOutlined style={{ fontSize: "1.3rem" }} />
                  </Button>
                </a>
              )}
              {member.discordId && (
                <Tooltip title={member.discordUsername}>
                  <Button shape="circle" size="small" variant="transparent">
                    <DiscordIcon />
                  </Button>
                </Tooltip>
              )}
              {member.github && (
                <a
                  href={"https://github.com/spect-ai"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button shape="circle" size="small" variant="transparent">
                    <GithubOutlined style={{ fontSize: "1.3rem" }} />
                  </Button>
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noreferrer">
                  <Button shape="circle" size="small" variant="transparent">
                    <Globe />
                  </Button>
                </a>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
