import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Heading, Input, Stack, Tag, Text } from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { createTemplateFlow } from "@/app/services/Templates";
import RewardTokenOptions from "../../Collection/AddField/RewardTokenOptions";
import { Registry } from "@/app/types";
import { useRouter } from "next/router";
import { getGuildRoles } from "@/app/services/Discord";

type Props = {
  handleClose: (close: boolean) => void;
};

export default function OnboardingTemplate({ handleClose }: Props) {
  const { localCircle: circle, fetchCircle, setCircleData } = useCircle();
  const [step, setStep] = useState(0);
  const [roles, setRoles] = useState();
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [networks, setNetworks] = useState<Registry>();

  const router = useRouter();

  useEffect(() => {
    if (!circle?.discordGuildId) {
      setStep(0);
    }
    if (circle?.discordGuildId && !roles) {
      setStep(1);
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

  const createFlow = async () => {
    handleClose(false);
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
    console.log({ res });
    if (res?.id) {
      setCircleData(res);
      void router.push(
        `${res.slug}/r/${
          res.collections[
            res?.folderDetails[res?.folderOrder?.[0]]?.contentIds?.[0]
          ].slug
        }`
      );
    }
  };

  useEffect(() => {
    const fetchGuildRoles = async () => {
      const data = await getGuildRoles(circle?.discordGuildId);
      data && setDiscordRoles(data.roles);
      console.log({ data });
    };
    if (circle?.discordGuildId) void fetchGuildRoles();
  }, [circle?.discordGuildId]);

  return (
    <Box padding={"0"}>
      <Stack direction={"vertical"} space="5">
        {step == 0 && (
          <Stack>
            <Heading color={"accent"} align="left">
              Integrate Discord
            </Heading>
            <Box width="1/3">
              <Stack direction="vertical">
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
                <Button
                  variant="tertiary"
                  size="small"
                  width={"full"}
                  onClick={async () => {
                    setStep(2);
                  }}
                >
                  Skip this
                </Button>
              </Stack>
            </Box>
          </Stack>
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
            <Stack direction={"horizontal"}>
              <Button
                variant="tertiary"
                size="small"
                width={"full"}
                onClick={async () => {
                  setStep(2);
                }}
              >
                Skip
              </Button>
              <Button
                width={"full"}
                onClick={() => setStep(2)}
                variant="secondary"
                size="small"
                disabled={!selectedRoles.length}
              >
                Next
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
                  setStep(1);
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => createFlow()}
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
