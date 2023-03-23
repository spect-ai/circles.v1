import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { UserType } from "@/app/types";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Tag, Text } from "degen";
import { useState } from "react";
import { Hidden } from "react-grid-system";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useCircle } from "../CircleContext";
import { Tooltip } from "react-tippy";
import { Globe } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { Embed } from "../../Collection/Embed";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useLocation } from "react-use";
import styled from "styled-components";

type Props = {};

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
`;

export default function Membership({}: Props) {
  const { navigationBreadcrumbs, memberDetails, circle } = useCircle();
  const [isEmebedOpen, setIsEmebedOpen] = useState(false);
  const { pathname, hostname } = useLocation();
  const route = pathname?.split("/")[2];

  return (
    <Box marginX="8" marginTop="2">
      <AnimatePresence>
        {isEmebedOpen && (
          <Embed
            isOpen={isEmebedOpen}
            setIsOpen={setIsEmebedOpen}
            component="members"
            routeId={circle?.slug || ""}
          />
        )}
      </AnimatePresence>
      {route !== "embed" && (
        <Stack space="0" direction="vertical" align="flex-start">
          <Hidden xs sm>
            <Box>
              {navigationBreadcrumbs && (
                <Breadcrumbs crumbs={navigationBreadcrumbs} />
              )}
            </Box>
          </Hidden>
          <Box display="flex" flexDirection="row" width="full">
            <Box
              display="flex"
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              width="full"
            >
              <Stack direction="horizontal" space="4" align="center">
                <Text size="headingThree" weight="semiBold" ellipsis>
                  Membership Center
                </Text>
              </Stack>
              <PrimaryButton onClick={() => setIsEmebedOpen(true)}>
                Embed
              </PrimaryButton>
            </Box>
          </Box>
        </Stack>
      )}
      <ScrollContainer>
        <Stack align="baseline" space="2" direction="horizontal" wrap>
          {circle?.members.map((member) => (
            <Member
              key={member}
              member={memberDetails?.memberDetails[member] as UserType}
              roles={circle.memberRoles[member]}
            />
          ))}
        </Stack>
      </ScrollContainer>
    </Box>
  );
}

type MemberProps = {
  member: UserType;
  roles: string[];
};

const Member = ({ member, roles }: MemberProps) => {
  return (
    <ResponsiveBox>
      <a
        href={`/profile/${member.username}`}
        target="_blank"
        rel="noreferrer"
        style={{
          width: "100%",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            cursor: "pointer",
          }}
        >
          <Box padding="2" margin="0">
            <Stack space="1" align="center">
              <Box
                style={{
                  marginBottom: "-2rem",
                  borderRadius: "50%",
                }}
              >
                <Avatar
                  src={
                    member.avatar ||
                    `https://api.dicebear.com/5.x/thumbs/svg?seed=${member.id}`
                  }
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
                boxShadow="0.5"
              >
                <Box marginTop="4" />
                <Stack align="center">
                  <Text weight="semiBold">{member.username}</Text>
                  <Stack direction="horizontal" space="1" wrap>
                    {roles.map((role, index) => (
                      <Stack direction="horizontal" space="1" align="center">
                        <Text key={role} variant="label">
                          {role}
                        </Text>
                        {index !== roles.length - 1 && (
                          <Text variant="label">|</Text>
                        )}
                      </Stack>
                    ))}
                  </Stack>
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
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                        >
                          <TwitterOutlined style={{ fontSize: "1.3rem" }} />
                        </Button>
                      </a>
                    )}
                    {member.discordId && (
                      <Tooltip title={member.discordUsername}>
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                        >
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
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                        >
                          <GithubOutlined style={{ fontSize: "1.3rem" }} />
                        </Button>
                      </a>
                    )}
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noreferrer">
                        <Button
                          shape="circle"
                          size="small"
                          variant="transparent"
                        >
                          <Globe />
                        </Button>
                      </a>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </motion.div>
      </a>
    </ResponsiveBox>
  );
};

const ResponsiveBox = styled(Box)`
  @media (max-width: 768px) {
    width: 99%;
  }
  @media (min-width: 768px) {
    width: 49.1%;
  }
  @media (min-width: 1024px) {
    width: 24.1%;
  }
  @media (min-width: 1280px) {
    width: 19.1%;
  }
`;
