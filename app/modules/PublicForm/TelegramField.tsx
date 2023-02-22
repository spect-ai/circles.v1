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
            (window as any).Telegram.Login.auth(
              { bot_id: "5655889542", request_access: true },
              (telegramData: any) => {
                setData({ ...data, [propertyName]: telegramData });
                updateRequiredFieldNotSet(propertyName, telegramData);
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
