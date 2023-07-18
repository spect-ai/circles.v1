import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { UserType } from "@/app/types";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Tag, Text, useTheme } from "degen";
import { useState } from "react";
import { Hidden } from "react-grid-system";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useCircle } from "../CircleContext";
import { Tooltip } from "react-tooltip";
import { Globe } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import { Embed } from "../../Collection/Embed";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useLocation } from "react-use";
import styled from "styled-components";
import ContributorsModal from "../ContributorsModal";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";

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

  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { mode } = useTheme();

  return (
    <Box
      marginX={{
        xs: "4",
        md: "8",
      }}
      marginTop="2"
    >
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <AnimatePresence>
        {isEmebedOpen && (
          <Embed
            setIsOpen={setIsEmebedOpen}
            embedRoute={`https://circles.spect.network/${circle?.slug}/embed?tab=membership`}
          />
        )}
        {isContributorsModalOpen && (
          <ContributorsModal
            handleClose={() => setIsContributorsModalOpen(false)}
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
              gap={{
                xs: "4",
                md: "0",
              }}
            >
              <Stack direction="horizontal" space="4" align="center">
                <Text size="headingThree" weight="semiBold" ellipsis>
                  Membership Center
                </Text>
                <PrimaryButton
                  variant="tertiary"
                  onClick={() => {
                    setIsContributorsModalOpen(true);
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Circle edit roles", {
                        circle: circle?.slug,
                        user: currentUser?.username,
                      });
                  }}
                >
                  <Text color="accent">Edit Roles</Text>
                </PrimaryButton>
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
          {circle?.members.map((member) => {
            if (
              circle.memberRoles[member]?.includes("__removed__") ||
              circle.memberRoles[member]?.includes("__left__")
            ) {
              return null;
            }
            const indexOfApplicantRole =
              circle.memberRoles[member]?.indexOf("applicant");
            if (indexOfApplicantRole > -1)
              circle.memberRoles[member]?.splice(indexOfApplicantRole, 1);
            const indexOfVoterRole =
              circle.memberRoles[member]?.indexOf("voter");
            if (indexOfVoterRole > -1)
              circle.memberRoles[member]?.splice(indexOfVoterRole, 1);
            if (circle.memberRoles[member]?.length === 0) return null;
            return (
              <Member
                key={member}
                member={memberDetails?.memberDetails[member] as UserType}
                roles={circle.memberRoles[member]}
              />
            );
          })}
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
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
                  {roles?.map((role, index) => (
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
                  {member.discordUsername && (
                    // <Tooltip title={member.discordUsername}>
                    <Button shape="circle" size="small" variant="transparent">
                      <DiscordIcon />
                    </Button>
                    // </Tooltip>
                  )}
                  {member.githubUsername && (
                    <a
                      href={`https://github.com/${member.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button shape="circle" size="small" variant="transparent">
                        <GithubOutlined style={{ fontSize: "1.3rem" }} />
                      </Button>
                    </a>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </motion.div>
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
