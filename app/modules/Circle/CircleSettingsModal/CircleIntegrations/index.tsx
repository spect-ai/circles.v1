import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useLocation } from "react-use";
import { useQuery as useApolloQuery } from "@apollo/client";
import { Space } from "@/app/modules/Collection/VotingModule";
import { updateCircle } from "@/app/services/UpdateCircle";
import DiscordRoleMapping from "../DiscordRoleMapping";
import ConnectGnosis from "../ConnectGnosis";
import GuildIntegration from "../GuildIntegration";
import GuildRoleMapping from "../GuildIntegration/GuildRoleMapping";
import { useCircle } from "../../CircleContext";

const CircleIntegrations = () => {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { circle } = useCircle();
  const { origin } = useLocation();
  const [snapshotSpace, setSnapshotSpace] = useState(
    circle?.snapshot?.id || ""
  );

  const { loading: isLoading, data } = useApolloQuery(Space, {
    variables: { id: snapshotSpace },
  });

  return (
    <Box>
      <Stack space="8">
        <Stack space="1">
          <Text variant="extraLarge" weight="bold">
            Guild.xyz
          </Text>
          <Text variant="label">Connect your guild and import roles</Text>
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
              marginTop={{
                xs: "0",
                md: "6",
              }}
            >
              <GuildIntegration />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
              marginTop={{
                xs: "0",
                md: "6",
              }}
            >
              <GuildRoleMapping />
            </Box>
          </Stack>
        </Stack>
        <Stack space="1">
          <Text variant="extraLarge" weight="bold">
            Discord
          </Text>
          <Text variant="label">
            Setup integration with discord. Connect your discord server to setup
            role gating.
          </Text>
        </Stack>
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
        >
          <Link
            href={`https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${cId}`}
          >
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <PrimaryButton
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
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
          >
            <DiscordRoleMapping />
          </Box>
        </Stack>
        <Stack space="1">
          <Text variant="extraLarge" weight="bold">
            Snapshot
          </Text>
          <Text variant="label">
            Enter your snapshot space to create and vote on proposals from Spect
          </Text>
          <Stack direction="horizontal" space="2" align="center">
            <Box width="1/2" marginTop="1">
              <Input
                label
                hideLabel
                prefix="https://snapshot.org/#/"
                value={snapshotSpace}
                placeholder="your-space.eth"
                onChange={(e) => {
                  setSnapshotSpace(e.target.value);
                }}
              />
            </Box>
            <PrimaryButton
              disabled={!data?.space?.id}
              loading={isLoading}
              onClick={async () => {
                await updateCircle(
                  {
                    snapshot: {
                      name: data?.space?.name || "",
                      id: snapshotSpace,
                      network: data?.space?.network || "",
                      symbol: data?.space?.symbol || "",
                    },
                  },
                  circle?.id as string
                );
              }}
            >
              Save
            </PrimaryButton>
          </Stack>
          {snapshotSpace &&
            !isLoading &&
            (data?.space?.id ? (
              <Text size="extraSmall" color="accent">
                Snapshot Space - {data?.space?.name}
              </Text>
            ) : (
              <Text color="red">Incorrect URL</Text>
            ))}
        </Stack>
        <Stack space="1">
          <Text variant="extraLarge" weight="bold">
            Gnosis
          </Text>
          <Text variant="label">
            Connect your gnosis safe to pay out from your safe.
          </Text>
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
            marginTop="6"
          >
            <ConnectGnosis />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CircleIntegrations;
