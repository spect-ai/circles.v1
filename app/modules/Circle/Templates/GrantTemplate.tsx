import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option, Registry } from "@/app/types";
import { Box, Button, Heading, Input, Stack, Tag, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";

import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import Dropdown from "@/app/common/components/Dropdown";
import { RocketOutlined } from "@ant-design/icons";
import { fetchGuildChannels, getGuildRoles } from "@/app/services/Discord";
import { Space } from "@/app/modules/Collection/VotingModule";
import { useQuery } from "@apollo/client";
import { createTemplateFlow } from "@/app/services/Templates";
import { useRouter } from "next/router";
import RewardTokenOptions from "../../Collection/AddField/RewardTokenOptions";

interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function GrantTemplate({ handleClose, setLoading }: Props) {
  const { localCircle: circle, fetchCircle, setCircleData } = useCircle();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [snapshotSpace, setSnapshotSpace] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(
    categoryOptions?.[0]
  );
  const [networks, setNetworks] = useState<Registry>();

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
  }, [circle?.discordGuildId]);

  const {
    loading: isLoading,
    data,
  } = useQuery(Space, { variables: { id: snapshotSpace } });

  const useTemplate = async () => {
    handleClose(false);
    setLoading(true);
    let roles = {};
    for (const i in selectedRoles) {
      roles = {
        ...roles,
        [selectedRoles[i]]: true,
      };
    }
    const res = await createTemplateFlow(
      circle?.id,
      {
        snapshot: {
          name: data?.space?.name || "",
          id: snapshotSpace,
          network: data?.space?.network || "",
          symbol: data?.space?.symbol || "",
        },
        roles,
        registry: networks,
      },
      1
    );
    console.log(res);
    if (res?.id) {
      setLoading(false);
      setCircleData(res);
    }
  };

  return (
    <Box padding="0">
      <Stack direction={"vertical"} space="5">
        {step == 0 && (
          <Stack>
            <Heading color={"accent"} align="left">
              Integrate Discord
            </Heading>
            <Box width="1/3">
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
                      `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle.slug}`,
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
                    setStep(2);
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
            {/* <Text variant="label">
              Select a channel category to create a Discord channel for accepted
              grant projects in your Discord Server
            </Text>
            <Box width={"1/3"}>
              <Dropdown
                options={categoryOptions}
                selected={selectedCategory}
                onChange={(value) => {
                  setSelectedCategory(value);
                }}
                multiple={false}
              />
            </Box> */}

            <Stack direction={"horizontal"}>
              <Button
                variant="tertiary"
                size="small"
                width={"fit"}
                onClick={() => {
                  setStep(2);
                  setSelectedRoles([]);
                  // setSelectedCategory({
                  //   label: "",
                  //   value: "",
                  // });
                }}
              >
                Skip
              </Button>
              <Button
                width={"fit"}
                onClick={() => {
                  setStep(2);
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
              width={"1/2"}
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
            <Stack direction={"horizontal"}>
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
                onClick={() => setStep(3)}
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
                "Add the token you'd want to use when paying grantees"
              }
              customTooltip={
                "Add the token you'd want to use when paying grantees"
              }
            />
            <Stack direction={"horizontal"}>
              <Button
                variant="transparent"
                size="small"
                onClick={() => {
                  setStep(2);
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => useTemplate()}
                variant="secondary"
                size="small"
              >
                Create Workflow
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}
