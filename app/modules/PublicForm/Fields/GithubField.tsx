import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyId: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  showAvatar?: boolean;
  verify?: boolean;
  showDisconnect?: boolean;
};

export default function GithubField({
  data,
  setData,
  propertyId,
  updateRequiredFieldNotSet,
  showAvatar,
  verify = false,
  showDisconnect = false,
}: Props) {
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
          `${process.env.API_HOST}/user/v1/connectGithub?code=${code}`,
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
          `${process.env.BOT_HOST}/connectGithub?code=${code}`
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
          <Stack direction="horizontal" align="center">
            {showAvatar && (
              <Avatar label="Github Avatar" src={data[propertyId].avatar_url} />
            )}
            <Box>
              <Text size="extraSmall" font="mono" weight="bold">
                {data[propertyId].login}
              </Text>
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
                    console.log("disconnecting github");
                    const res = await fetch(
                      `${process.env.API_HOST}/user/v1/disconnectGithub`,
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
                  <Text
                    size="extraSmall"
                    font="mono"
                    weight="bold"
                    color="accent"
                  >
                    Disconnect
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <PrimaryButton
          variant="tertiary"
          icon={<FaGithub size={24} />}
          onClick={async () => {
            const url = `https://github.com/login/oauth/authorize?client_id=4403e769e4d52b24eeab`;
            window.open(url, "popup", "width=600,height=600");
          }}
        >
          Connect Github
        </PrimaryButton>
      )}
    </Box>
  );
}
