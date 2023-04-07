import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Text } from "degen";
import { FaTelegram } from "react-icons/fa";

type Props = {
  setData: (data: {
    [key: string]: {
      id: string;
      username: string;
    };
  }) => void;
  data: {
    [key: string]: {
      id: string;
      username: string;
    };
  };
  propertyName: string;
  updateRequiredFieldNotSet: (
    key: string,
    value: {
      id: string;
      username: string;
    }
  ) => void;
};

type Window = {
  Telegram: {
    Login: {
      auth: (
        data: {
          bot_id: string;
          request_access: boolean;
        },
        callback: (data: unknown) => void
      ) => void;
    };
  };
};

const TelegramField = ({
  data,
  setData,
  propertyName,
  updateRequiredFieldNotSet,
}: Props) => (
  <Box marginTop="4" width="64">
    {data[propertyName] && data[propertyName]?.id ? (
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
          (window as unknown as Window).Telegram.Login.auth(
            { bot_id: "5655889542", request_access: true },
            (telegramData: unknown) => {
              const typedData = telegramData as {
                id: string;
                username: string;
              };
              setData({ ...data, [propertyName]: typedData });
              updateRequiredFieldNotSet(propertyName, typedData);
            }
          );
        }}
      >
        Connect Telegram
      </PrimaryButton>
    )}
  </Box>
);

export default TelegramField;
