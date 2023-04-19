import { Heading, Stack, Text, Button, IconSparkles, Box } from "degen";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import mixpanel from "@/app/common/utils/mixpanel";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import { useLocation } from "react-use";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FaDiscord } from "react-icons/fa";
import { joinCirclesFromDiscord } from "@/app/services/JoinCircle";
import queryClient from "@/app/common/utils/queryClient";

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

export function BasicProfile({ setStep }: { setStep: (step: number) => void }) {
  return (
    <Box
      width={{ xs: "full", md: "fit", lg: "128" }}
      marginTop={{
        xs: "32",
        md: "60",
      }}
    >
      <Stack align="center" space="6">
        <Stack
          direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}
          align="center"
        >
          <IconSparkles color={"accent"} size="8" />
          <Heading responsive>Connect your Discord</Heading>
        </Stack>
        <Text align={"center"}>
          Connecting your Discord automatically lets you claim roles in all your
          spaces that have setup Discord roles.
        </Text>
        <ConnectDiscordButton setStep={setStep} />
        <Box
          onClick={() => {
            setStep(1);
          }}
          cursor="pointer"
        >
          <Text color={"textTertiary"}>Let&apos;s skip this</Text>
        </Box>
      </Stack>
    </Box>
  );
}

const ConnectDiscordButton = ({
  setStep,
}: {
  setStep: (step: number) => void;
}) => {
  const { hostname } = useLocation();
  const [code, setCode] = useState("");
  const { updateProfile } = useProfileUpdate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        // if (event.origin !== "http://example.org:8080")
        //   return;
        if (event.data.code) {
          setCode(event.data.code);
        }
      },
      false
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (!code) return;
      console.log({ code });
      const res = await fetch(
        `${process.env.API_HOST}/user/v1/connectDiscord?code=${code}`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        queryClient.setQueryData("getMyUser", data);
        setLoading(false);
        process.env.NODE_ENV === "production" &&
          mixpanel.track("Onboard discord", {
            user: data.username,
          });
        setStep(1);
      }
    })();
  }, [code]);

  return (
    <PrimaryButton
      loading={loading}
      icon={<FaDiscord size={24} />}
      onClick={async () => {
        setLoading(true);
        const url = `https://discord.com/api/oauth2/authorize?client_id=${
          process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
        }&redirect_uri=${
          process.env.NODE_ENV === "development"
            ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
            : `https%3A%2F%2F${hostname}%2FlinkDiscord`
        }&response_type=code&scope=guilds%20identify`;
        window.open(url, "popup", "width=600,height=600");
      }}
    >
      Connect Discord
    </PrimaryButton>
  );
};
