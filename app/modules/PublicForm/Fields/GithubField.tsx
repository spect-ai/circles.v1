import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyName: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
};

export default function GithubField({
  data,
  setData,
  propertyName,
  updateRequiredFieldNotSet,
}: Props) {
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
        `${process.env.BOT_HOST}/connectGithub?code=${code}`
      );
      if (res.ok) {
        const data = await res.json();
        console.log({ data });
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
            <Avatar label="Github Avatar" src={data[propertyName].avatar_url} />
            <Box>
              <Text size="extraSmall" font="mono" weight="bold">
                {data[propertyName].login}
              </Text>
            </Box>
          </Stack>
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
