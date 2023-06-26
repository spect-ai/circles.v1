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
};

export default function CreateFromTemplateModal({
  template,
  handleClose,
}: Props) {
  const { mode } = useTheme();
  const [destinationCircle, setDestinationCircle] = useState<CircleType>(
    {} as CircleType
  );
  const [newCircleName, setNewCircleName] = useState<string>("");
  const { myCircles, loadingMyCircles, fetchCircles } =
    useProviderLocalProfile();
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

  const handleNext = async (
    skip?: boolean,
    circleSpecificInfo?: CircleSpecificInfo
  ) => {
    try {
      const newCircleSpecificInfoDto = [...circleSpecificInfoDto];
      if (currentIndex === -1 && template.automations?.length) {
        setCurrentIndex(0);
        return;
      } else {
        if (
          template.automations?.length &&
          template.automations?.length !== circleSpecificInfoDto?.length
        ) {
          newCircleSpecificInfoDto.push({
            type: "automation",
            id: template.automations[currentIndex].id,
            info: circleSpecificInfo,
            skip: skip,
          });
          setCurrentIndex(currentIndex + 1);
          return;
        }
      }
      const res = await useTemplate(
        template.id,
        destinationCircle.id,
        newCircleSpecificInfoDto
      );
      if (res.ok) {
        const data = await res.json();

        console.log({ data });
        // window.open(`http://localhost:3000/${data.id}`, "_blank");
      }
    } catch (e) {
      console.log({ e });
      toast.error("Something went wrong while using this template");
    }
  };

  useEffect(() => {
    if (template.automations?.length && destinationCircle?.id) {
      const requiresDiscordConnection = template.automations?.some(
        (automation) =>
          automation.requirements.includes("discordRole") ||
          automation.requirements.includes("discordChannel")
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
        console.log({ res });
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

  const toggleSelectedRole = (index: number, roleId: string) => {
    setCircleSpecificInfoDto((prev) => {
      let newCircleSpecificInfoDto = [...prev];
      console.log({ newCircleSpecificInfoDto });
      let info =
        newCircleSpecificInfoDto[index]?.info || ({} as CircleSpecificInfo);
      const roleIds = info.roleIds || [];
      console.log({ roleIds, roleId });
      if (roleIds.includes(roleId)) {
        info = {
          ...info,
          roleIds: roleIds.filter((id: string) => id !== roleId),
        };
      } else {
        console.log("soso");
        info = { ...info, roleIds: [...roleIds, roleId] };
      }
      console.log({ info });
      newCircleSpecificInfoDto[index] = {
        type: "automation",
        id: template.automations[index].id,
        info: info,
      };

      console.log({ newCircleSpecificInfoDto });
      return newCircleSpecificInfoDto;
    });
  };

  const updateSelectedChannel = (
    index: number,
    channel: OptionType,
    channelType: "channel" | "category" = "channel"
  ) => {
    setCircleSpecificInfoDto((prev) => {
      let newCircleSpecificInfoDto = [...prev];
      console.log({ newCircleSpecificInfoDto });
      let info = newCircleSpecificInfoDto[index]?.info || {};
      info = {
        ...info,
        [channelType]: channel,
      };
      newCircleSpecificInfoDto[index] = {
        type: "automation",
        id: template.automations[index].id,
        info: info,
      };
      return newCircleSpecificInfoDto;
    });
  };

  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.discordGuildId) {
          const connectDiscord = async () => {
            const res = await updateCircle(
              {
                discordGuildId: event.data.discordGuildId,
              },
              destinationCircle.id
            );
            if (res?.discordGuildId) {
              setDestinationCircle((prev) => ({
                ...prev,
                discordGuildId: event.data.discordGuildId,
              }));
              setDiscordIsConnected(true);
              setRequiresDiscordConnection(false);
              fetchCircles();
            }
          };
          void connectDiscord();
        }
      },
      false
    );
  }, []);

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

                          await handleNext(false);
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
                  console.log({ circleData });
                  const res = await useTemplate(template.id, circleData.id);
                  console.log(res);
                  if (res.ok) {
                    const data = await res.json();
                  }
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
            <Stack>
              {!requiresDiscordConnection &&
                template.automations?.[currentIndex]?.requirements.includes(
                  "discordRole"
                ) && (
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
                              toggleSelectedRole(currentIndex, role.id)
                            }
                          >
                            {circleSpecificInfoDto?.[currentIndex]?.info
                              ?.roleIds?.length &&
                            (
                              circleSpecificInfoDto?.[currentIndex]
                                .info as CircleSpecificInfo
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
              {!requiresDiscordConnection &&
                template.automations?.[currentIndex]?.requirements.includes(
                  "discordChannel"
                ) &&
                currentIndex > -1 && (
                  <Stack>
                    <Dropdown
                      label="Pick a Discord channel"
                      options={guildChannels}
                      selected={
                        (
                          circleSpecificInfoDto?.[currentIndex]
                            ?.info as CircleSpecificInfo
                        )?.channel || {
                          label: "Select a channel",
                          value: "",
                        }
                      }
                      onChange={(value) => {
                        updateSelectedChannel(currentIndex, value);
                      }}
                      multiple={false}
                      portal={true}
                      isClearable={false}
                    />
                  </Stack>
                )}
              {!requiresDiscordConnection &&
                template.automations?.[currentIndex]?.requirements.includes(
                  "discordCategory"
                ) &&
                currentIndex > -1 && (
                  <Stack>
                    <Dropdown
                      label="Pick a Discord category"
                      options={guildCategories}
                      selected={
                        (
                          circleSpecificInfoDto?.[currentIndex]
                            ?.info as CircleSpecificInfo
                        )?.category || {
                          label: "Select a category",
                          value: "",
                        }
                      }
                      onChange={(value) => {
                        updateSelectedChannel(currentIndex, value, "category");
                      }}
                      multiple={false}
                      portal={false}
                      isClearable={false}
                    />
                  </Stack>
                )}
            </Stack>
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
                      !(
                        circleSpecificInfoDto?.[currentIndex]?.info &&
                        (circleSpecificInfoDto?.[currentIndex]?.info?.roleIds
                          ?.length ||
                          circleSpecificInfoDto?.[currentIndex]?.info?.channel
                            ?.value ||
                          circleSpecificInfoDto?.[currentIndex]?.info?.category
                            ?.value)
                      )
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
                    ? `Skip this and use template`
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
