import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType } from "@/app/types";
import { GithubOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Text } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import DiscordRoleMapping from "../DiscordRoleMapping";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";

export default function CircleIntegrations() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  console.log({ circle });
  return (
    <Box>
      <Stack space="8">
        <Stack space="1">
          <Heading>Discord</Heading>
          <Text>
            Setup integration with discord. Connect your discord server to setup
            role gating.
          </Text>
        </Stack>
        <Stack direction="horizontal">
          <Link
            href={`https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${
              process.env.NODE_ENV !== "production"
                ? "http://localhost:3000/"
                : "https://spect-discord-bot.herokuapp.com/"
            }api/connectDiscord&response_type=code&scope=bot&state=${cId}`}
          >
            <Box width="1/3">
              <PrimaryButton
                disabled={!!circle?.discordGuildId}
                icon={
                  <Box marginTop="1">
                    <DiscordIcon />
                  </Box>
                }
              >
                {circle?.discordGuildId
                  ? "Discord Connected"
                  : "Connect Discord"}
              </PrimaryButton>
            </Box>
          </Link>
          {circle?.discordGuildId && (
            <Box width="1/3">
              <DiscordRoleMapping />
            </Box>
          )}
        </Stack>
        <Stack space="1">
          <Heading>Github</Heading>
          <Text>Connect github to link PR to cards and more</Text>
          <Box width="1/3" marginTop="6">
            <Link
              href={`https://github.com/apps/spect-github-bot/installations/new?state=${circle?.id}`}
            >
              <PrimaryButton
                icon={
                  <GithubOutlined
                    style={{
                      fontSize: "1.3rem",
                    }}
                  />
                }
              >
                {circle?.githubRepos ? `Configure Github` : "Connect Github"}
              </PrimaryButton>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
