import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Avatar, Box, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { FaTelegram } from "react-icons/fa";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyName: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
};

export default function TelegramField({
  data,
  setData,
  propertyName,
  updateRequiredFieldNotSet,
}: Props) {
  const [userData, setUserData] = useState<any>();
  useEffect(() => {
    console.log("useEffect");
    window.addEventListener(
      "message",
      (event) => {
        // if (event.origin !== "http://example.org:8080")
        //   return;
        console.log({ event });
        if (event.data.userData) {
          setUserData(event.data.userData);
        }
      },
      false
    );
  }, []);

  useEffect(() => {
    if (userData) {
      setData((data: any) => ({ ...data, [propertyName]: userData }));
      updateRequiredFieldNotSet(propertyName, userData);
    }
  }, [userData]);

  return (
    <Box marginTop="4" width="64">
      {data[propertyName] && data[propertyName].id ? (
        <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
          <Box>
            <Text size="extraSmall" font="mono" weight="bold">
              {data[propertyName].username}
            </Text>
          </Box>
        </Box>
      ) : (
        <PrimaryButton
          variant="tertiary"
          icon={<FaTelegram size={24} />}
          onClick={async () => {
            // const url = `https://oauth.telegram.org/auth?bot_id=5655889542&origin=dev.spect.network&request_access=write&return_to=https%3A%2F%2Fdev.spect.network%2FauthCallback`;
            // window.open(url, "popup", "width=600,height=600");
            (window as any).Telegram.Login.auth(
              { bot_id: "5655889542", request_access: true },
              (data: any) => {
                console.log({ data });
              }
            );
          }}
        >
          Connect Telegram
        </PrimaryButton>
      )}
    </Box>
  );
}
