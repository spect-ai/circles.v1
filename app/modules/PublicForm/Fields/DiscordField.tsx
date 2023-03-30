import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useLocation } from "react-use";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyName: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
};

export default function DiscordField({
  data,
  setData,
  propertyName,
  updateRequiredFieldNotSet,
}: Props) {
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
      console.log({ code });
      const res = await fetch(
        `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.userData.id) {
          setData((d: any) => ({
            ...d,
            [propertyName]: data.userData,
          }));
          updateRequiredFieldNotSet(propertyName, data.userData);
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
      )}
    </Box>
  );
}
