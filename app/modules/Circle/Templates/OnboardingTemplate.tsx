import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Heading, Input, Stack, Tag, Text } from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { createTemplateFlow } from "@/app/services/Templates";

type Props = {
  handleClose: (close: boolean) => void;
};

export default function OnboardingTemplate({ handleClose }: Props) {
  const { localCircle: circle, fetchCircle } = useCircle();
  const [step, setStep] = useState(0);
  const [roles, setRoles] = useState();
  const [selectedRoles, setSelectedRoles] = useState([] as string[]);

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

  return (
    <Box padding={"0"}>
      <Heading color={"accent"} align="left">
        Integrate Discord
      </Heading>
      <Box paddingY={"6"}>
        <Stack direction={"vertical"} space="5">
          {step == 0 && (
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
                    const res = await createTemplateFlow(circle?.id, {}, 2);
                    handleClose(false);
                    console.log(res);
                    if (res?.id) fetchCircle();
                  }}
                >
                  Skip this
                </Button>
              </Stack>
            </Box>
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
                    setSelectedRoles([]);
                    //   setLoading(true);
                    const res = await createTemplateFlow(circle?.id, {}, 2);
                    handleClose(false);
                    console.log(res);
                    if (res?.id) fetchCircle();
                  }}
                >
                  Skip
                </Button>
                <Button
                  width={"full"}
                  onClick={async () => {
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
                    console.log(res);
                    handleClose(false);
                    if (res?.id) fetchCircle();
                  }}
                  variant="secondary"
                  size="small"
                  disabled={!selectedRoles.length}
                >
                  Next
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
