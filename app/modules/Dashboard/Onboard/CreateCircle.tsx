import { Stack, IconTokens, Heading, Text, Box, Button } from "degen";
import { NameInput } from "./BasicProfile";
import { useState } from "react";
import { RocketOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { generateColorHEX } from "@/app/common/utils/utils";
import { useGlobal } from "@/app/context/globalContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { UserType } from "@/app/types";

type CreateCircleDto = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  gradient: string;
};

interface Props {
  setStep: (step: number) => void;
}

export function CreateCircle({ setStep }: Props) {
  const [circleName, setCircleName] = useState("");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

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
      marginTop={"60"}
    >
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
        onClick={() => {
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
                setStep(2);
              }
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Onboard circle", {
                  user: currentUser?.username,
                });
            })
            .catch((err) => console.log({ err }));
        }}
        prefix={<RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />}
        variant="secondary"
        size="small"
        disabled={circleName.length == 0}
      >
        LFG
      </Button>
    </Box>
  );
}
