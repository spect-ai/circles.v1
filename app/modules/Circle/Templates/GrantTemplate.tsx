import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option, Registry } from "@/app/types";
import { Box, Button, Heading, Input, Stack, Tag, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";

import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Dropdown from "@/app/common/components/Dropdown";
import { RocketOutlined } from "@ant-design/icons";
import { fetchGuildChannels, getGuildRoles } from "@/app/services/Discord";
import { createTemplateFlow } from "@/app/services/Templates";
import { useRouter } from "next/router";
import RewardTokenOptions from "../../Collection/AddField/RewardTokenOptions";
import { useAtom } from "jotai";
import { Scribes } from "@/app/common/utils/constants";
import { Space } from "@/app/modules/Collection/VotingModule";
import { useQuery } from "@apollo/client";
import { updateCircle } from "@/app/services/UpdateCircle";
import { scribeOpenAtom, scribeUrlAtom } from "@/app/state/global";

interface Props {
  handleClose: (close: boolean) => void;
}

export default function GrantTemplate({ handleClose }: Props) {
  const { circle, registry, fetchCircle, setCircleData } = useCircle();
  const [step, setStep] = useState(0);
  const [snapshotSpace, setSnapshotSpace] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  const [networks, setNetworks] = useState<Registry | undefined>({
    "137": registry?.["137"],
  } as Registry);

  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);

  const [loading, setLoading] = useState(false);

  const { loading: isLoading, data } = useQuery(Space, {
    variables: { id: snapshotSpace },
  });

  useEffect(() => {
    if (!circle?.discordGuildId) {
      setStep(0);
    }
    if (circle?.discordGuildId) {
      setStep(1);
    }
  }, [circle?.discordGuildId]);

  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();

  useEffect(() => {
    if (circle) {
      const getGuildChannels = async () => {
        const data = await fetchGuildChannels(
          circle?.discordGuildId,
          "GUILD_CATEGORY"
        );
        const categoryOptions = data.guildChannels?.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }));
        setCategoryOptions(categoryOptions);
      };
      if (circle?.discordGuildId) void getGuildChannels();
      const fetchGuildRoles = async () => {
        const data = await getGuildRoles(circle?.discordGuildId);
        data && setDiscordRoles(data.roles);
        console.log({ data });
      };
      if (circle?.discordGuildId) void fetchGuildRoles();
    }
  }, [circle?.discordGuildId]);

  const useTemplate = async () => {
    setLoading(true);
    let roles = {};
    for (const i in selectedRoles) {
      roles = {
        ...roles,
        [selectedRoles[i]]: true,
      };
    }
    const res = await createTemplateFlow(
      circle?.id || "",
      {
        roles,
        registry: networks,
      },
      1
    );
    console.log(res);
    if (res?.id) {
      setScribeUrl(Scribes.grants.using);
      setIsScribeOpen(true);
      console.log("here");
      setCircleData(res);
    }
    handleClose(false);
    setLoading(false);
  };

  return (
    <Box padding="0">
      <Stack direction={"vertical"} space="5">
        {step == 0 && (
          <Stack>
            <Heading color={"accent"} align="left">
              Integrate Discord
            </Heading>
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <Stack direction="vertical">
                <PrimaryButton
                  disabled={!!circle?.discordGuildId}
                  icon={
                    <Box marginTop="1">
                      <DiscordIcon />
                    </Box>
                  }
                  onClick={() => {
                    window.open(
                      `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}`,
                      "_blank"
                    );

                    const interval = setInterval(() => {
                      fetchCircle();
                    }, 5000);

                    setTimeout(() => {
                      clearInterval(interval);
                    }, 60000);
                  }}
                >
                  {circle?.discordGuildId
                    ? "Discord Connected"
                    : "Connect Discord"}
                </PrimaryButton>
                <PrimaryButton
                  variant="tertiary"
                  onClick={() => {
                    if (!circle?.snapshot?.id) {
                      setStep(2);
                    } else {
                      setStep(3);
                    }
                  }}
                >
                  Skip this
                </PrimaryButton>
              </Stack>
            </Box>
          </Stack>
        )}
        {step == 1 && (
          <>
            <Heading color={"accent"} align="left">
              Integrate Discord
            </Heading>
            <Text variant="label">
              Which Discord role would you like to assign to the grantees ?
            </Text>
            <Stack direction={"horizontal"} space={"4"} wrap>
              {discordRoles?.map((role) => (
                <Box
                  onClick={() => {
                    if (selectedRoles.includes(role.id)) {
                      setSelectedRoles(
                        selectedRoles.filter((r) => r !== role.id)
                      );
                    } else {
                      setSelectedRoles([...selectedRoles, role.id]);
                    }
                  }}
                  cursor="pointer"
                >
                  <Tag
                    key={role.id}
                    tone={
                      selectedRoles.includes(role.id) ? "accent" : "secondary"
                    }
                  >
                    {role.name}
                  </Tag>
                </Box>
              ))}
            </Stack>

            <Stack direction={"horizontal"}>
              <Button
                variant="tertiary"
                size="small"
                width={"fit"}
                onClick={() => {
                  if (!circle?.snapshot?.id) {
                    setStep(2);
                  } else {
                    setStep(3);
                  }
                  setSelectedRoles([]);
                }}
              >
                Skip
              </Button>
              <Button
                width={"fit"}
                onClick={() => {
                  if (!circle?.snapshot?.id) {
                    setStep(2);
                  } else {
                    setStep(3);
                  }
                }}
                variant="secondary"
                size="small"
                disabled={!selectedRoles.length}
              >
                Integrate Discord
              </Button>
            </Stack>
          </>
        )}
        {step == 2 && (
          <>
            <Heading color={"accent"} align="left">
              Enable Snapshot voting on Spect
            </Heading>
            <Text variant="label">Integrate Snapshot</Text>
            <Input
              label
              hideLabel
              width={{
                xs: "full",
                md: "1/2",
              }}
              prefix="https://snapshot.org/#/"
              value={snapshotSpace}
              placeholder="your-space.eth"
              onChange={(e) => {
                setSnapshotSpace(e.target.value);
              }}
            />
            {snapshotSpace &&
              !isLoading &&
              (data?.space?.id ? (
                <Text size={"extraSmall"} color="accent">
                  Snapshot Space - {data?.space?.name}
                </Text>
              ) : (
                <Text color={"red"}>Incorrect URL</Text>
              ))}
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
            >
              <Button
                variant="transparent"
                size="small"
                onClick={() => {
                  if (!circle?.discordGuildId) {
                    setStep(0);
                  } else if (circle?.discordGuildId) {
                    setStep(1);
                  }
                }}
              >
                Back
              </Button>
              <Button
                variant="tertiary"
                size="small"
                onClick={() => {
                  setStep(3);
                  setSnapshotSpace("");
                }}
              >
                Skip this
              </Button>
              <Button
                onClick={async () => {
                  setStep(3);
                  if (snapshotSpace && data?.space?.id) {
                    const circleRes = await updateCircle(
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
                    setCircleData(circleRes);
                  }
                }}
                prefix={
                  <RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />
                }
                variant="secondary"
                size="small"
                disabled={!snapshotSpace || !data?.space?.id}
              >
                Integrate Snapshot
              </Button>
            </Stack>
          </>
        )}
        {step == 3 && (
          <>
            <Heading color={"accent"} align="left">
              Add Custom Token
            </Heading>
            <RewardTokenOptions
              networks={networks}
              setNetworks={setNetworks}
              customText={
                "Add the tokens you'd want to use when disbursing funds to grantees"
              }
              customTooltip={
                "Add the tokens you'd want to use when paying grantees"
              }
              newTokenOpen={true}
            />
            <Box display={"flex"} flexDirection="row" gap={"2"} marginTop="8">
              <Button
                variant="transparent"
                size="small"
                onClick={() => {
                  if (!circle?.snapshot?.id) {
                    setStep(2);
                  } else if (!circle?.discordGuildId) {
                    setStep(0);
                  } else {
                    setStep(1);
                  }
                }}
              >
                Back
              </Button>
              <Button
                loading={loading}
                onClick={useTemplate}
                variant="secondary"
                size="small"
              >
                Create Workflow
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
