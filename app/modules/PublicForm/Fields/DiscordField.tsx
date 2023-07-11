import { Button, Text } from "@avp1598/vibes";
import { Avatar, Box, Stack } from "degen";
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
  showDisconnect?: boolean;
};

export default function DiscordField({
  data,
  setData,
  propertyId,
  updateRequiredFieldNotSet,
  showAvatar,
  verify = false,
  showDisconnect = false,
}: Props) {
  const { hostname } = useLocation();
  const [code, setCode] = useState("");
  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
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
            <Box overflow={"hidden"}>
              <Text>{data[propertyId].username}</Text>
            </Box>
          </Stack>
          {showDisconnect && (
            <Box marginTop="2" paddingRight="4">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Box
                  cursor="pointer"
                  onClick={async () => {
                    console.log("disconnecting discord");
                    const res = await fetch(
                      `${process.env.API_HOST}/user/v1/disconnectDiscord`,
                      {
                        credentials: "include",
                        method: "PATCH",
                      }
                    );
                    if (res.ok) {
                      setData((d: any) => ({
                        ...d,
                        [propertyId]: null,
                      }));
                      updateRequiredFieldNotSet(propertyId, null);
                    }
                  }}
                >
                  <Text type="label">Disconnect</Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Button
          variant="secondary"
          // icon={<FaDiscord size={24} />}
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
        </Button>
      )}
    </Box>
  );
}
