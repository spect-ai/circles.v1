import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { UserType } from "@/app/types";
import { RocketOutlined } from "@ant-design/icons";
import { Box, Button, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

interface Props {
  setOnboardType: () => void;
}

export function AddUsername({ setOnboardType }: Props) {
  const router = useRouter();
  const [username, setCircleName] = useState("");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { updateProfile } = useProfileUpdate();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

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
        <Text color="accent">
          <Heading>👋</Heading>
        </Text>
        <Stack direction="horizontal" align="center" space="2">
          <Text variant="extraLarge">Gm!</Text>
        </Stack>
        <Text variant="extraLarge">How should we call you, anon?</Text>

        <Box
          width={"3/4"}
          marginTop="8"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Text align={"center"}>Add a username</Text>
        </Box>

        <NameInput
          placeholder="punknoir17"
          value={username}
          onChange={(e) => {
            setUsernameError("");
            setCircleName(e.target.value);
          }}
        />
        {usernameError && (
          <Text color="red" variant="small" align="center">
            {usernameError}
          </Text>
        )}
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const res = await updateProfile({
                username: username,
              });

              setOnboardType();
            } catch (e) {
              console.log({ e });
              setUsernameError((e as any).message || e);
            }
            setLoading(false);
          }}
          prefix={<RocketOutlined style={{ fontSize: "1.2rem" }} rotate={30} />}
          variant="secondary"
          size="small"
          disabled={username.length == 0}
        >
          Set Username
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
