import { Stack, IconTokens, Heading, Text, Box, Button } from "degen";
import { NameInput } from "./BasicProfile";
import { useState } from "react";
import { RocketOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { generateColorHEX } from "@/app/common/utils/utils";
import { useGlobal } from "@/app/context/globalContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { UserType } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Link from "next/link";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { joinCirclesFromGuildxyz } from "@/app/services/JoinCircle";
import { useLocation } from "react-use";

type CreateCircleDto = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  gradient: string;
};

interface Props {
  setStep: (step: number) => void;
  setOnboardType: (type: "profile" | "circle") => void;
}

export function CreateCircle({ setStep, setOnboardType }: Props) {
  const [circleName, setCircleName] = useState("");
  const [part, setPart] = useState(0);
  const [slug, setSlug] = useState("");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { origin } = useLocation();

  const { mutateAsync } = useMutation((circle: CreateCircleDto) => {
    return fetch(`${process.env.API_HOST}/circle/v1`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(circle),
      credentials: "include",
    });
  });

  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      alignItems="center"
      marginTop={"48"}
    >
      {part == 0 && (
        <>
          <Stack direction={"horizontal"} align="center">
            <IconTokens color={"accent"} size="8" />
            <Heading>Let&apos;s create a Circle</Heading>
          </Stack>
          <Box
            width={"3/4"}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Text align={"center"}>
              A Circle is a workspace for you and your frens. Circles come with
              roles, integrations such as Gnosis, Discord and Guild.xyz
            </Text>
            <Text align={"center"} color="textSecondary">
              Give your Circle a name
            </Text>
          </Box>

          <NameInput
            placeholder="Meta DAO"
            value={circleName}
            onChange={(e) => {
              setCircleName(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              const color1 = generateColorHEX();
              const color2 = generateColorHEX();
              const color3 = generateColorHEX();
              const gradient = `linear-gradient(300deg, ${color1}, ${color2}, ${color3})`;
              mutateAsync({
                name: circleName,
                description: `${circleName}'s Circle`,
                avatar: "",
                private: false,
                gradient,
              })
                .then(async (res) => {
                  const resJson = await res.json();
                  console.log({ resJson });
                  if (resJson.slug) {
                    setSlug(resJson.slug);
                    setPart(1);
                  }
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Onboard circle", {
                      user: currentUser?.username,
                    });
                })
                .catch((err) => console.log({ err }));
              await joinCirclesFromGuildxyz(currentUser?.ethAddress as string);
            }}
            prefix={
              <RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />
            }
            variant="secondary"
            size="small"
            disabled={circleName.length == 0}
          >
            LFG
          </Button>
          <Box
            width={"3/4"}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Text align={"center"}>
              Not here to manage your DAO? Set up your profile instead to
              receive notifications about new opportunities being created on
              Spect.
            </Text>
          </Box>
          <PrimaryButton
            onClick={async () => {
              setStep(3);
              setOnboardType("profile");
              await joinCirclesFromGuildxyz(currentUser?.ethAddress as string);
            }}
          >
            Set up Profile
          </PrimaryButton>
        </>
      )}
      {part == 1 && (
        <>
          <Stack direction={"horizontal"} align="center">
            <IconTokens color={"accent"} size="8" />
            <Heading>Connect your Discord Server</Heading>
          </Stack>
          <Box
            width={"3/4"}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Text align={"center"}>
              Discord Integration will help you import roles, import discussion
              channels & optimize grant workflows
            </Text>
          </Box>
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
            onClick={() => {
              window.open(
                `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${slug}`,
                "_blank"
              );
              setStep(2);
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
          <Box onClick={() => setStep(2)} cursor="pointer">
            <Text color={"textTertiary"}>Let&apos;s skip this</Text>
          </Box>
        </>
      )}
    </Box>
  );
}
