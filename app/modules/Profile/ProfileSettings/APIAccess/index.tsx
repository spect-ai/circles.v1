import PrimaryButton from "@/app/common/components/PrimaryButton";
import { logError } from "@/app/common/utils/utils";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import {
  Box,
  Button,
  IconCopy,
  IconPlusSmall,
  IconTrash,
  Stack,
  Text,
} from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useProfile } from "../LocalProfileContext";

export default function APIAccess() {
  const { createAPIKey, deleteApiKey } = useProfileUpdate();
  const [loading, setLoading] = useState(false);
  const { apiKeys, setApiKeys } = useProfile();
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);

  useEffect(() => {
    setLocalApiKeys(apiKeys);
  }, [apiKeys]);

  return (
    <Box
      paddingX={{
        xs: "2",
        md: "8",
      }}
      paddingY="4"
    >
      <Stack>
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
          space="4"
        >
          <PrimaryButton
            size="extraSmall"
            variant="tertiary"
            loading={loading}
            icon={<IconPlusSmall size="4" />}
            onClick={async () => {
              setLoading(true);
              try {
                const res = await createAPIKey();
                console.log({ res });
                setApiKeys(res);
              } catch (e) {
                toast.error(
                  "Error creating API key, please reach out to support"
                );
                logError("Error creating API key");
              }

              setLoading(false);
            }}
          >
            Create API key
          </PrimaryButton>
        </Stack>

        <Text variant="label">Your API keys</Text>
        {localApiKeys?.length > 0 &&
          localApiKeys.map((key, index) => {
            return (
              <ScrollContainer key={index}>
                <Box
                  borderColor="foregroundTertiary"
                  borderWidth="0.5"
                  borderRadius="large"
                  width="3/4"
                  padding="2"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box width="3/4">
                      <Text variant="small">
                        {key.substring(0, 7) + `${"*".repeat(20)}`}
                      </Text>
                    </Box>
                    <Button
                      size="extraSmall"
                      shape="circle"
                      variant="transparent"
                      onClick={() => {
                        void navigator.clipboard.writeText(`${key}`);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      {" "}
                      <Text>
                        <IconCopy size="4" />
                      </Text>
                    </Button>
                    <Button
                      size="extraSmall"
                      shape="circle"
                      variant="transparent"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const res = await deleteApiKey(key);
                          setApiKeys(res);
                        } catch (e) {
                          toast.error(
                            "Error deleting API key, please reach out to support"
                          );
                          logError("Error deleting API key");
                        }

                        setLoading(false);
                      }}
                    >
                      {" "}
                      <Text>
                        <IconTrash size="4" />
                      </Text>
                    </Button>
                  </Box>
                </Box>
              </ScrollContainer>
            );
          })}
        {(localApiKeys === undefined || localApiKeys?.length === 0) && (
          <Text>You have no API keys</Text>
        )}
      </Stack>
    </Box>
  );
}

export const MenuContainer = styled(Box)<{ cWidth?: string }>`
  width: ${(props) => props.cWidth || "25rem"};
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: rgb(28, 25, 31);
  transition: all 0.15s ease-out;

  max-height: 20rem;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 15rem;
  }
`;

export const MenuItem = styled(Box)`
  width: 100%;
  transition: background 0.2s ease;
`;

export const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  overflow-y: auto;
`;
