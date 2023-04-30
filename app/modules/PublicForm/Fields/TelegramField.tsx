import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import { FaTelegram } from "react-icons/fa";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyId: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
};

export default function TelegramField({
  data,
  setData,
  propertyId,
  updateRequiredFieldNotSet,
}: Props) {
  return (
    <Box marginTop="4" width="64">
      {data[propertyId] && data[propertyId].id ? (
        <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
          <Stack direction="horizontal" align="center" justify="center">
            <Text size="extraSmall" font="mono" weight="bold">
              {data[propertyId].username}
            </Text>
          </Stack>
        </Box>
      ) : (
        <PrimaryButton
          variant="tertiary"
          icon={<FaTelegram size={24} />}
          onClick={async () => {
            (window as any).Telegram.Login.auth(
              { bot_id: "5655889542", request_access: true },
              (telegramData: any) => {
                setData({ ...data, [propertyId]: telegramData });
                updateRequiredFieldNotSet(propertyId, telegramData);
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
