import { Button, Text } from "@avp1598/vibes";
import { Box, Stack } from "degen";
import { FaTelegram } from "react-icons/fa";

type Props = {
  setData: (data: any) => void;
  data: any;
  propertyId: string;
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  error?: string;
};

export default function TelegramField({
  data,
  setData,
  propertyId,
  updateRequiredFieldNotSet,
  error,
}: Props) {
  return (
    <Box marginTop="4" width="64">
      {data[propertyId] && data[propertyId].id ? (
        <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
          <Stack direction="horizontal" align="center" justify="center">
            <Box overflow={"hidden"}>
              <Text weight="bold">{data[propertyId].username}</Text>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Button
          variant="secondary"
          icon={<FaTelegram size={18} />}
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
        </Button>
      )}
      {error && (
        <Box marginTop="2">
          <Text>{error}</Text>
        </Box>
      )}
    </Box>
  );
}
