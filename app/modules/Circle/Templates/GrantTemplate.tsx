import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType, Option } from "@/app/types";
import { Box, Button, Heading, Input, Stack, Tag, Text } from "degen";
import Link from "next/link";
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

interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function GrantTemplate({ handleClose, setLoading }: Props) {
  const { localCircle: circle, fetchCircle } = useCircle();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [snapshotSpace, setSnapshotSpace] = useState("");
  const [permissions, setPermissions] = useState([] as string[]);
  const [roles, setRoles] = useState();
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [categoreyOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(
    categoreyOptions?.[0]
  );

  useEffect(() => {
    if (!circle?.discordGuildId) {
      setStep(0);
    }
    if (circle?.discordGuildId && !roles) {
      setStep(1);
    }
    if (circle?.discordGuildId && roles) {
      setStep(2);
    }
  }, []);

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
    error,
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
        permissions: permissions,
        channelCategory: selectedCategory,
        roles,
      },
      1
    );
    console.log(res);
    if (res?.id) fetchCircle();
    setTimeout(() => setLoading(false), 300);
  };
  return (
    <Box padding={"8"}>
      <Heading color={"accent"} align="center">
        Awesome! Lets set up a Grants Workflow
      </Heading>
      {/* <Text variant="base">Would you like to give the grantees a discord role ?</Text> */}
      <Box paddingY={"6"}>
        <Stack direction={"vertical"} space="5" align={"center"}>
          {step == 0 && (
            <>
              <Text align={"center"}>Would you like to connect discord ?</Text>
              <Text align={"center"}>
                Just a few clicks and the grantees will have a discord role,
                every grants project will have a channel in your discord server
              </Text>

              <Stack direction={"horizontal"}>
                <Button
                  variant="tertiary"
                  size="small"
                  width={"full"}
                  onClick={() => setStep(2)}
                >
                  Skip this
                </Button>
                <Link
                  href={`https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle.slug}`}
                >
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
                </Link>
              </Stack>
            </>
          )}
          {step == 1 && (
            <>
              <Text align={"center"} variant="large">
                Users will be asked to Connect Discord before they fill up the
                form if you opt for any of these features
              </Text>
              <Text align={"center"}>
                Which roles would you like to give the grantees ?
              </Text>
              <Stack direction={"horizontal"} space={"4"}>
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
                      {role.name}{" "}
                    </Tag>
                  </Box>
                ))}
              </Stack>
              <Text align={"center"}>
                Would you like to create a channel for each grant project which
                has been accepted ? If yes, please select a channel category
              </Text>
              <Dropdown
                options={categoreyOptions}
                selected={selectedCategory}
                onChange={(value) => {
                  setSelectedCategory(value);
                }}
                multiple={false}
              />
              <Stack direction={"horizontal"}>
                <Button
                  variant="tertiary"
                  size="small"
                  width={"full"}
                  onClick={() => {
                    setStep(2);
                    setSelectedRoles([]);
                    setSelectedCategory({
                      label: "",
                      value: "",
                    });
                  }}
                >
                  Skip
                </Button>
                <Button
                  width={"full"}
                  onClick={() => {
                    setStep(2);
                  }}
                  variant="secondary"
                  size="small"
                  disabled={!selectedRoles.length && !selectedCategory?.value}
                >
                  Next
                </Button>
              </Stack>
            </>
          )}
          {step == 2 && (
            <>
              <Text align={"center"}>
                Would you like to integrate Snapshot in your grants program ?
              </Text>
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
              <Text align={"center"}>
                Which of these roles would you like to notify after creating a
                proposal ? These roles will have the permissions to view the
                form's responses
              </Text>
              <Box display={"flex"} flexDirection="row" gap={"2"}>
                {Object.keys(circle.roles)?.map((role) => {
                  return (
                    <Box
                      key={role}
                      onClick={() => {
                        if (permissions.includes(role)) {
                          setPermissions(
                            permissions.filter((item) => item !== role)
                          );
                        } else {
                          setPermissions([...permissions, role]);
                        }
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Tag
                        hover
                        size="medium"
                        as="span"
                        tone={
                          permissions.includes(role) ? "accent" : "secondary"
                        }
                      >
                        {role}
                      </Tag>
                    </Box>
                  );
                })}
              </Box>
              <Stack direction={"horizontal"}>
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={async () => {
                    handleClose(false);
                    setLoading(true);
                    let roles = {};
                    for (const i in selectedRoles) {
                      roles = {
                        ...roles,
                        [selectedRoles[i]]: true,
                      };
                    }
                    const res: CircleType = await createTemplateFlow(
                      circle?.id,
                      {
                        channelCategory: selectedCategory,
                        roles,
                      },
                      1
                    );
                    console.log(res);
                    if (res?.id) {
                      fetchCircle();
                    }
                    setTimeout(() => setLoading(false), 300);
                    router.push(
                      `${res.slug}/r/${
                        res.collections[
                          res?.folderDetails[res?.folderOrder?.[0]]
                            ?.contentIds?.[0]
                        ].slug
                      }`
                    );
                  }}
                >
                  Skip this
                </Button>
                <Button
                  onClick={() => useTemplate()}
                  prefix={
                    <RocketOutlined
                      style={{ fontSize: "1.2rem" }}
                      rotate={30}
                    />
                  }
                  variant="secondary"
                  size="small"
                  disabled={
                    !snapshotSpace || !permissions.length || !data?.space?.id
                  }
                >
                  Integrate Snapshot
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
