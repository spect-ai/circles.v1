import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useLocation } from "react-use";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyId: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  showAvatar?: boolean;
  verify?: boolean;
};

export default function DiscordField({
  data,
  setData,
  propertyId,
  updateRequiredFieldNotSet,
  showAvatar,
  verify = false,
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
      if (verify) {
        const res = await fetch(
          `${process.env.API_HOST}/user/v1/connectDiscord?code=${code}`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const { userData } = await res.json();
          console.log({ userData });
          if (userData.id) {
            setData((d: any) => ({
              ...d,
              [propertyId]: userData,
            }));
            updateRequiredFieldNotSet(propertyId, userData);
          }
        }
      } else {
        const res = await fetch(
          `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.userData.id) {
            setData((d: any) => ({
              ...d,
              [propertyId]: data.userData,
            }));
            updateRequiredFieldNotSet(propertyId, data.userData);
          }
        }
      }
    })();
  }, [code]);

  return (
    <Box marginTop="4" width="64">
      {data[propertyId] && data[propertyId].id ? (
        <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
          <Stack direction="horizontal" align="center" justify="center">
            {showAvatar && (
              <Avatar
                label="Discord Avatar"
                src={`https://cdn.discordapp.com/avatars/${data[propertyId].id}/${data[propertyId].avatar}.png`}
              />
            )}
            <Box>
              <Text size="extraSmall" font="mono" weight="bold">
                {data[propertyId].username}
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
      )}
    </Box>
  );
}
