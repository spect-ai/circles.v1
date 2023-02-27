import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Heading, Stack, Tag, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { createTemplateFlow } from "@/app/services/Templates";
import { getGuildRoles } from "@/app/services/Discord";
import { useAtom } from "jotai";
import { scribeOpenAtom, scribeUrlAtom } from "@/pages/_app";
import { Scribes } from "@/app/common/utils/constants";

type Props = {
  handleClose: (close: boolean) => void;
};

export default function OnboardingTemplate({ handleClose }: Props) {
  const { circle, fetchCircle, setCircleData } = useCircle();
  const [step, setStep] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);

  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);

  useEffect(() => {
    if (!circle?.discordGuildId) {
      setStep(0);
    }
    if (circle?.discordGuildId && !selectedRoles.length) {
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
      },
      2
    );
    console.log({ res });
    if (res?.id) {
      setScribeUrl(Scribes.onboarding.using);
      setIsScribeOpen(true);
      setCircleData(res);
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
                <Button
                  variant="tertiary"
                  size="small"
                  width={"full"}
                  onClick={() => {
                    createFlow();
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
            <Heading color={"accent"} align="left">
              Integrate Discord
            </Heading>
            <Text variant="label">
              Which Discord role would you like to assign to the contributors ?
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
              {/* <Button
                variant="tertiary"
                size="small"
                width={"full"}
                onClick={async () => {
                  setStep(2);
                }}
              >
                Skip
              </Button> */}
              <Button
                width="1/2"
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
