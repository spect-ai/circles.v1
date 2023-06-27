import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { duplicateCircle } from "@/app/services/Circle";
import {
  CircleSpecificInfo,
  UseTemplateCircleSpecificInfoDto,
  useTemplate,
} from "@/app/services/Templates";
import { CircleType, DiscordChannel, Template, UserType } from "@/app/types";
import {
  Box,
  Button,
  IconChevronLeft,
  Input,
  Spinner,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useProviderLocalProfile } from "../Profile/ProfileSettings/LocalProfileContext";
import Logo from "@/app/common/components/Logo";
import { toast } from "react-toastify";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import {
  fetchGuildChannels,
  getGuildRoles,
  guildIsConnected,
} from "@/app/services/Discord";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import Dropdown from "@/app/common/components/Dropdown";
import { OptionType } from "@/app/common/components/CreatableDropdown";
import { updateCircle } from "@/app/services/UpdateCircle";
import { useConnectDiscordServerFromTemplate } from "@/app/services/Discord/useConnectDiscordServer";
import { useRouter } from "next/router";

type Props = {
  template: Template;
  handleClose: () => void;
  destinationCircle: CircleType;
  setDestinationCircle: (circle: CircleType) => void;
};

export default function CreateFromTemplateModal({
  template,
  handleClose,
  destinationCircle,
  setDestinationCircle,
}: Props) {
  const { mode } = useTheme();
  const [newCircleName, setNewCircleName] = useState<string>("");
  const { myCircles, loadingMyCircles } = useProviderLocalProfile();
  const [circleSpecificInfoDto, setCircleSpecificInfoDto] = useState<
    UseTemplateCircleSpecificInfoDto[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [requiresDiscordConnection, setRequiresDiscordConnection] =
    useState<boolean>(false);
  const [discordIsConnected, setDiscordIsConnected] = useState(false);
  const [guildChannels, setGuildChannels] = useState<DiscordChannel[]>([]);
  const [guildCategories, setGuildCategories] = useState<DiscordChannel[]>([]);

  const [discordRoles, setDiscordRoles] =
    useState<
      | {
          id: string;
          name: string;
        }[]
      | undefined
    >();

  const handleNext = async (skip?: boolean, destCircle?: CircleType) => {
    try {
      const nextIndex = currentIndex + 1;
      const newCircleSpecificInfoDto = [...circleSpecificInfoDto];
      if (currentIndex === -1 && template.automations?.length) {
        setCurrentIndex(0);
        return;
      } else if (skip) {
        newCircleSpecificInfoDto[currentIndex] = {
          type: "automation",
          id: template.automations[currentIndex].id,
          actions: [],
        };
        setCircleSpecificInfoDto(newCircleSpecificInfoDto);
      }

      console.log({ newCircleSpecificInfoDto });
      if (nextIndex === template.automations?.length) {
        const res = await useTemplate(
          template.id,
          destCircle?.id || destinationCircle.id,
          newCircleSpecificInfoDto
        );
        if (res.redirectUrl) {
          handleClose();
          window.open(
            `https://circles.spect.network${res.redirectUrl}`,
            "_blank"
          );
        } else {
          toast.error("Something went wrong while using this template");
        }
      } else setCurrentIndex(nextIndex);
    } catch (e) {
      console.log({ e });
      toast.error("Something went wrong while using this template");
    }
  };

  useEffect(() => {
    if (template.automations?.length && destinationCircle?.id) {
      const requiresDiscordConnection = template.automations?.some(
        (automation) => {
          const actionRequirements = automation.actions
            .map((a) => a.requirements)
            .flat();
          return (
            actionRequirements.includes("discordRole") ||
            actionRequirements.includes("discordChannel") ||
            actionRequirements.includes("discordCategory")
          );
        }
      );
      setRequiresDiscordConnection(
        !destinationCircle.discordGuildId && requiresDiscordConnection
      );
    }
  }, [destinationCircle]);

  useEffect(() => {
    if (destinationCircle?.discordGuildId) {
      const discordIsConnected = async () => {
        const res = await guildIsConnected(destinationCircle?.discordGuildId);
        setDiscordIsConnected(res);
      };
      void discordIsConnected();
    }
  }, [destinationCircle?.discordGuildId]);

  useEffect(() => {
    if (!discordIsConnected || !destinationCircle?.discordGuildId) return;
    const fetchGuildRoles = async () => {
      const roles = await getGuildRoles(
        destinationCircle?.discordGuildId,
        true
      );
      roles && setDiscordRoles(roles);
    };
    const getGuildChannels = async () => {
      const channels = await fetchGuildChannels(
        destinationCircle?.discordGuildId,
        ChannelType.GuildText,
        false,
        [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
      );
      const categoryOptions = channels?.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      }));
      setGuildChannels(categoryOptions);
    };
    const getGuildCategories = async () => {
      const channels = await fetchGuildChannels(
        destinationCircle?.discordGuildId,
        ChannelType.GuildCategory
      );
      const categoryOptions = channels?.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      }));
      setGuildCategories(categoryOptions);
    };
    if (destinationCircle?.discordGuildId) {
      void fetchGuildRoles();
      void getGuildChannels();
      void getGuildCategories();
    }
  }, [discordIsConnected]);

  const toggleSelectedRole = (
    index: number,
    actionIndex: number,
    roleId: string
  ) => {
    setCircleSpecificInfoDto((prev) => {
      let newCircleSpecificInfoDto = [...prev];
      const actions = newCircleSpecificInfoDto[index]?.actions || [];
      let info = actions[actionIndex]?.info || ({} as CircleSpecificInfo);
      info = {
        ...info,
        roleIds: info?.roleIds?.includes(roleId)
          ? info?.roleIds?.filter((r) => r !== roleId)
          : [...(info?.roleIds || []), roleId],
      };
      const newActions = [...actions];
      newActions[actionIndex] = {
        ...newActions[actionIndex],
        info: info,
      };
      newCircleSpecificInfoDto[index] = {
        type: "automation",
        id: template.automations[index].id,
        actions: newActions,
      };
      return newCircleSpecificInfoDto;
    });
  };

  const updateSelectedChannel = (
    index: number,
    actionIndex: number,
    channel: OptionType,
    channelType: "channel" | "category" = "channel"
  ) => {
    setCircleSpecificInfoDto((prev) => {
      let newCircleSpecificInfoDto = [...prev];
      const actions = newCircleSpecificInfoDto[index]?.actions || [];
      let info = actions[actionIndex]?.info || ({} as CircleSpecificInfo);
      info = {
        ...info,
        [channelType]: channel,
      };
      actions[actionIndex] = {
        ...actions[actionIndex],
        info: info,
      };
      newCircleSpecificInfoDto[index] = {
        type: "automation",
        id: template.automations[index].id,
        actions: actions,
      };
      return newCircleSpecificInfoDto;
    });
  };

  return (
    <Modal size="small" title="Use Template" handleClose={handleClose}>
      {currentIndex === -1 && (
        <Box padding="8" paddingTop="4">
          {loadingMyCircles && <Spinner />}
          {!loadingMyCircles && myCircles && myCircles?.length > 0 ? (
            <Stack space="4">
              <Text variant="base" color="textSecondary">
                Pick a space where you would like to add this template
              </Text>
              <ScrollContainer>
                <Stack direction="horizontal" space="4" wrap>
                  {myCircles
                    ?.filter(
                      (circle) =>
                        !circle.parents || circle.parents?.length === 0
                    )
                    .map((circle) => (
                      <SpaceTag
                        mode={mode}
                        key={circle.id}
                        cursor="pointer"
                        onClick={async () => {
                          setDestinationCircle(circle);

                          await handleNext(false, circle);
                        }}
                      >
                        <Logo
                          href={``}
                          src={circle.avatar}
                          gradient={circle.gradient}
                          name={circle.name}
                          size={"7"}
                        />
                        <Text>{circle.name}</Text>
                      </SpaceTag>
                    ))}
                </Stack>{" "}
              </ScrollContainer>
            </Stack>
          ) : (
            <Stack space="4">
              <Input
                label="Please create a space where this template will be used"
                placeholder="Enter a name for your space"
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
              />
              <PrimaryButton
                size="large"
                variant="secondary"
                onClick={async () => {
                  const circleRes = await fetch(
                    `${process.env.API_HOST}/circle/v1`,
                    {
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      method: "POST",
                      body: JSON.stringify({
                        name: newCircleName,
                      }),
                      credentials: "include",
                    }
                  );
                  const circleData = await circleRes.json();
                  await useTemplate(template.id, circleData.id);
                }}
              >
                Use Template
              </PrimaryButton>
            </Stack>
          )}
        </Box>
      )}
      {currentIndex !== -1 && template.automations?.[currentIndex] && (
        <Box padding="8" paddingTop="4">
          <Stack space="4">
            <Text variant="base" color="textSecondary">
              This template has the following automation.
            </Text>
            <Text variant="base" color="textSecondary">
              {template.automations[currentIndex].name}
            </Text>
            <Text variant="base" color="textSecondary">
              {template.automations[currentIndex].description}
            </Text>
          </Stack>
          <Stack space="4">
            <Text variant="base" color="textSecondary">
              To add this automation to your space, please perform the
              following.
            </Text>
            {!requiresDiscordConnection &&
              template.automations?.[currentIndex]?.actions?.map(
                (ta, actionIndex) => {
                  return (
                    <Stack>
                      {ta.requirements.includes("discordRole") && (
                        <Stack space="1">
                          <Box marginLeft="2">
                            <Text variant="small" color="textSecondary">
                              Pick Discord roles
                            </Text>
                          </Box>
                          <Stack direction="horizontal" wrap>
                            {discordRoles?.map((role) => {
                              return (
                                <Box
                                  key={role.id}
                                  cursor="pointer"
                                  onClick={() =>
                                    toggleSelectedRole(
                                      currentIndex,
                                      actionIndex,
                                      role.id
                                    )
                                  }
                                >
                                  {(
                                    circleSpecificInfoDto?.[currentIndex]
                                      ?.actions?.[actionIndex]
                                      ?.info as CircleSpecificInfo
                                  )?.roleIds?.length &&
                                  (
                                    circleSpecificInfoDto?.[currentIndex]
                                      ?.actions?.[actionIndex]
                                      ?.info as CircleSpecificInfo
                                  ).roleIds?.includes(role.id) ? (
                                    <Tag tone={"accent"} hover>
                                      <Box paddingX="2">{role.name}</Box>
                                    </Tag>
                                  ) : (
                                    <Tag hover>
                                      <Box paddingX="2">{role.name}</Box>
                                    </Tag>
                                  )}
                                </Box>
                              );
                            })}{" "}
                          </Stack>
                        </Stack>
                      )}
                      {ta.requirements.includes("discordChannel") &&
                        currentIndex > -1 && (
                          <Stack>
                            <Dropdown
                              label="Pick a Discord channel"
                              options={guildChannels}
                              selected={
                                (
                                  circleSpecificInfoDto?.[currentIndex]
                                    ?.actions?.[actionIndex]
                                    ?.info as CircleSpecificInfo
                                )?.channel || {
                                  label: "Select a channel",
                                  value: "",
                                }
                              }
                              onChange={(value) => {
                                updateSelectedChannel(
                                  currentIndex,
                                  actionIndex,
                                  value
                                );
                              }}
                              multiple={false}
                              portal={true}
                              isClearable={false}
                            />
                          </Stack>
                        )}
                      {ta.requirements.includes("discordCategory") &&
                        currentIndex > -1 && (
                          <Stack>
                            <Dropdown
                              label="Pick a Discord category"
                              options={guildCategories}
                              selected={
                                (
                                  circleSpecificInfoDto?.[currentIndex]
                                    ?.actions?.[actionIndex]
                                    ?.info as CircleSpecificInfo
                                )?.category || {
                                  label: "Select a category",
                                  value: "",
                                }
                              }
                              onChange={(value) => {
                                updateSelectedChannel(
                                  currentIndex,
                                  actionIndex,
                                  value,
                                  "category"
                                );
                              }}
                              multiple={false}
                              portal={false}
                              isClearable={false}
                            />
                          </Stack>
                        )}
                    </Stack>
                  );
                }
              )}
            <Stack direction="horizontal" justify={"space-between"}>
              {requiresDiscordConnection && (
                <Box
                  width="48"
                  onClick={() => {
                    window.open(
                      `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=templates`,
                      "popup",
                      "width=600,height=600"
                    );
                  }}
                >
                  <PrimaryButton
                    icon={
                      <Box marginTop="1">
                        <DiscordIcon />
                      </Box>
                    }
                  >
                    Connect Discord
                  </PrimaryButton>
                </Box>
              )}
              {!requiresDiscordConnection && currentIndex > -1 && (
                <Box width="48">
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={async () => {
                      await handleNext(false);
                    }}
                    disabled={
                      !circleSpecificInfoDto?.[currentIndex]?.actions?.length
                    }
                  >
                    {currentIndex === template.automations?.length - 1
                      ? `Use Template`
                      : `Next`}
                  </Button>
                </Box>
              )}
              {currentIndex > -1 && (
                <Button
                  size="small"
                  variant="transparent"
                  onClick={async () => {
                    await handleNext(true);
                  }}
                >
                  {currentIndex === template.automations?.length - 1
                    ? `Skip this and use template >`
                    : `Skip this automation >`}
                </Button>
              )}{" "}
            </Stack>
          </Stack>
        </Box>
      )}{" "}
    </Modal>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  max-height: 24rem;
  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

export const SpaceTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 1.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  width: fit-content;
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
`;
