import { Heading, Stack, Text, Button, IconSparkles, Box } from "degen";
import styled from "styled-components";
import { useState } from "react";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { RocketOutlined } from "@ant-design/icons";

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
  const updateUser = async () => {
    const res = await updateProfile({
      username: userName,
    });
    if (res) {
      setStep(1);
    }
  };
  return (
    <Box
      display={"flex"}
      flexDirection="column"
      gap={"5"}
      alignItems="center"
      marginTop={"60"}
    >
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
        prefix={<RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />}
        variant="secondary"
        size="small"
        disabled={userName.length == 0}
      >
        Let&apos;s Go
      </Button>
    </Box>
  );
}
