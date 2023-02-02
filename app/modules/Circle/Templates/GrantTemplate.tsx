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
import { scribeOpenAtom, scribeUrlAtom } from "@/pages/_app";
import { Scribes } from "@/app/common/utils/constants";

interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function GrantTemplate({ handleClose, setLoading }: Props) {
  const {
    localCircle: circle,
    registry,
    fetchCircle,
    setCircleData,
  } = useCircle();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(
    categoryOptions?.[0]
  );
  const [networks, setNetworks] = useState<Registry | undefined>({
    "137": registry?.["137"],
  } as Registry);

  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);

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
        roles,
        registry: networks,
      },
      1
    );
    console.log(res);
    if (res?.id) {
      setScribeUrl(Scribes.grants.using);
      setIsScribeOpen(true);
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

            <Stack direction={"horizontal"}>
              <Button
                variant="tertiary"
                size="small"
                width={"fit"}
                onClick={() => {
                  setStep(2);
                  setSelectedRoles([]);
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
                  setStep(1);
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
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
}
