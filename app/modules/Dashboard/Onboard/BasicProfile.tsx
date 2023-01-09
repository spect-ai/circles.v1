import { Heading, Stack, Text, Button, IconSparkles, Box } from "degen";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { RocketOutlined } from "@ant-design/icons";
import mixpanel from "@/app/common/utils/mixpanel";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import Link from "next/link";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useLocation } from "react-use";
import ConnectDiscordButton from "@/app/common/components/ConnectDiscordButton";

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
  const { updateProfile } = useProfileUpdate();
  const [userName, setUserName] = useState("");
  const { hostname } = useLocation();
  const [part, setPart] = useState(0);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const updateUser = async () => {
    const res = await updateProfile({
      username: userName,
    });
    if (res) {
      setStep(1);
    }
    process.env.NODE_ENV === "production" &&
      mixpanel.track("Onboard profile", {
        user: currentUser?.username,
      });
  };

  useEffect(() => {
    if (currentUser?.discordUsername) setPart(1);
  }, []);
  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      width={{ xs: "full", md: "fit", lg: "128" }}
      alignItems="center"
      marginTop={"60"}
    >
      {currentUser?.username.startsWith("fren") && part == 1 && (
        <>
          <Stack
            direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}
            align="center"
          >
            <IconSparkles color={"accent"} size="8" />
            <Heading responsive>You made it to Spect, WAGMI !</Heading>
          </Stack>
          <Text>So, how should we call you ?</Text>
          <NameInput
            placeholder="swollen-punk"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Button
            onClick={updateUser}
            prefix={
              <RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />
            }
            variant="secondary"
            size="small"
            disabled={userName.length == 0}
          >
            Let&apos;s Go
          </Button>
        </>
      )}
      {!currentUser?.discordUsername &&
        currentUser?.username.startsWith("fren") &&
        part == 0 && (
          <>
            <Stack
              direction={{ xs: "vertical", md: "horizontal", lg: "horizontal" }}
              align="center"
            >
              <IconSparkles color={"accent"} size="8" />
              <Heading responsive>Connect your Discord</Heading>
            </Stack>
            <Text align={"center"}>
              Connecting your Discord automatically lets you claim roles in all
              your circles that have setup Discord roles.
            </Text>
            <ConnectDiscordButton width="full"/>
            <Box onClick={() => setPart(1)} cursor="pointer">
              <Text color={"textTertiary"}>Let&apos;s skip this</Text>
            </Box>
          </>
        )}
    </Box>
  );
}
