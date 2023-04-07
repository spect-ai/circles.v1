import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useLocation } from "react-use";

type DiscordCredentials = {
  id: string;
  username: string;
  avatar: string;
};

type Props = {
  setData: (data: Record<string, DiscordCredentials>) => void;
  data: Record<string, DiscordCredentials>;
  propertyName: string;
  updateRequiredFieldNotSet: (
    key: string,
    value: Record<string, DiscordCredentials>
  ) => void;
};

const DiscordField = ({
  data,
  setData,
  propertyName,
  updateRequiredFieldNotSet,
}: Props) => {
  const { hostname } = useLocation();
  const [code, setCode] = useState("");
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
      const res = await fetch(
        `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
      );
      if (res.ok) {
        const d = await res.json();
        if (d.userData.id) {
          // setData((d: any) => ({
          //   ...d,
          //   [propertyName]: data.userData,
          // }));
          const newData = {
            ...data,
            [propertyName]: d.userData,
          };
          setData(newData);
          updateRequiredFieldNotSet(propertyName, d.userData);
        }
      }
    })();
  }, [code]);

  return (
    <Box marginTop="4" width="64">
      {data[propertyName] && data[propertyName].id ? (
        <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
          <Stack direction="horizontal" align="center">
            <Avatar
              label="Discord Avatar"
              src={`https://cdn.discordapp.com/avatars/${data[propertyName].id}/${data[propertyName].avatar}.png`}
            />
            <Box>
              <Text size="extraSmall" font="mono" weight="bold">
                {data[propertyName].username}
              </Text>
            </Box>
          </Stack>
        </Box>
      ) : (
        <PrimaryButton
          variant="tertiary"
          icon={<FaDiscord size={24} />}
          onClick={async () => {
            const url = `https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
              process.env.NODE_ENV === "development"
                ? "http%3A%2F%2Flocalhost%3A3000%2FlinkDiscord"
                : `https%3A%2F%2F${hostname}%2FlinkDiscord`
            }&response_type=code&scope=guilds%20identify`;
            window.open(url, "popup", "width=600,height=600");
          }}
        >
          Connect Discord
        </PrimaryButton>
      )}
    </Box>
  );
};

export default DiscordField;
