import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Heading, Stack, Tag, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { createTemplateFlow } from "@/app/services/Templates";
import { getGuildRoles } from "@/app/services/Discord";
import { useAtom } from "jotai";
import { Scribes } from "@/app/common/utils/constants";
import { scribeOpenAtom, scribeUrlAtom } from "@/app/state/global";

type Props = {
  handleClose: (close: boolean) => void;
};

export default function OnboardingTemplate({ handleClose }: Props) {
  const { circle, fetchCircle, setCircleData } = useCircle();
  const [step, setStep] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);
  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);
  const [loading, setLoading] = useState(false);

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
      },
      2
    );
    console.log({ res });
    if (res?.id) {
      setScribeUrl(Scribes.onboarding.using);
      setIsScribeOpen(true);
      setCircleData(res);
    }
    setLoading(false);
    handleClose(false);
  };

  useEffect(() => {
    const fetchGuildRoles = async () => {
      const roles = await getGuildRoles(circle?.discordGuildId || "");
      roles && setDiscordRoles(roles);
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
                <Button
                  variant="tertiary"
                  size="small"
                  width={"full"}
                  onClick={createFlow}
                  loading={loading}
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
                onClick={createFlow}
                variant="secondary"
                size="small"
                loading={loading}
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
