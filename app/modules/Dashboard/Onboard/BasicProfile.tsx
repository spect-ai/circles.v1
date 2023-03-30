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
  // const { updateProfile } = useProfileUpdate();
  // const [userName, setUserName] = useState("");
  // const [part, setPart] = useState(0);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  // const updateUser = async () => {
  //   const res = await updateProfile({
  //     username: userName,
  //   });
  //   if (res) {
  //     setStep(1);
  //   } else {
  //     toast.error("Username already taken");
  //   }
  // };

  // useEffect(() => {
  //   if (currentUser?.discordUsername) setPart(1);
  // }, []);
  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      width={{ xs: "full", md: "fit", lg: "128" }}
      alignItems="center"
      marginTop={"60"}
    >
      <Stack align="center">
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
        `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
      );
      if (res.ok) {
        const data = await res.json();
        console.log({ data });
        const random2Digit = Math.floor(Math.random() * 100);
        const profileRes = await updateProfile({
          discordId: data.userData.id,
          discordUsername:
            data.userData.username === undefined
              ? undefined
              : data.userData.username + "#" + data.userData.discriminator,
          username: data.userData.username + "_" + random2Digit,
        });
        console.log({ profileRes });
        setLoading(false);
        joinCirclesFromDiscord(data.guildData, data.userData.id);
        process.env.NODE_ENV === "production" &&
          mixpanel.track("Onboard discord", {
            user: data.userData.username + "_" + random2Digit,
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
          process.env.DISCORD_CLIENT_ID
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
