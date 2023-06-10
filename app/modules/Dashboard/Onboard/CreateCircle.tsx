import { Stack, IconTokens, Heading, Text, Box, Button } from "degen";
import { useState } from "react";
import { RocketOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { generateColorHEX } from "@/app/common/utils/utils";
import mixpanel from "@/app/common/utils/mixpanel";
import { UserType } from "@/app/types";
import { joinCirclesFromGuildxyz } from "@/app/services/JoinCircle";
import { useRouter } from "next/router";
import { createDefaultProject } from "@/app/services/Defaults";
import { MdGroupWork } from "react-icons/md";
import styled from "styled-components";

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
  const router = useRouter();
  const [circleName, setCircleName] = useState("");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [loading, setLoading] = useState(false);

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
      alignItems="center"
      marginTop={{
        xs: "24",
        md: "48",
      }}
    >
      <Stack align="center">
        {/* <IconTokens color={"accent"} size="8" /> */}
        <Heading align="center">
          Let&apos;s create a space for you & your frens
        </Heading>
        <Text color="accent">
          <MdGroupWork size="40" />
        </Text>
        <Box
          width={"3/4"}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Text align={"center"}>
            Give your space a name and we&apos;ll get you started
          </Text>
        </Box>

        <NameInput
          placeholder="My Space"
          value={circleName}
          onChange={(e) => {
            setCircleName(e.target.value);
          }}
        />
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true);
            const color1 = generateColorHEX();
            const color2 = generateColorHEX();
            const color3 = generateColorHEX();
            const gradient = `linear-gradient(300deg, ${color1}, ${color2}, ${color3})`;
            mutateAsync({
              name: circleName,
              description: `Welcome to ${circleName}`,
              avatar: "",
              private: false,
              gradient,
            })
              .then(async (res) => {
                const resJson = await res.json();
                console.log({ resJson });
                if (resJson.slug) {
                  void joinCirclesFromGuildxyz(
                    currentUser?.ethAddress as string
                  );
                  await createDefaultProject(resJson.id);
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Onboard circle", {
                      user: currentUser?.username,
                    });
                  console.log("redirecting to circle");
                  void router.push(`/${resJson.slug}`);
                }
                setLoading(false);
              })
              .catch((err) => {
                console.log({ err });
                setLoading(false);
              });
          }}
          prefix={<RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />}
          variant="secondary"
          size="small"
          disabled={circleName.length == 0}
        >
          Let's goo
        </Button>
      </Stack>
    </Box>
  );
}

export const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
  text-align: center;
`;
