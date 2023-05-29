import { Credential } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { CredentialCard, PluginAdded } from "../LinkCredentialsModal";
import Image from "next/image";

type Props = {
  credentials: Credential[];
  selectedCredentials: { [id: string]: boolean };
  onCredentialClick: (credential: Credential) => void;
};

export const Mintkudos = ({
  credentials,
  selectedCredentials,
  onCredentialClick,
}: Props) => {
  const { mode } = useTheme();

  if (!credentials?.length)
    return (
      <Box
        marginTop="8"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text>No credentials found</Text>
      </Box>
    );
  return (
    <Box>
      {credentials?.map((credential, index) => {
        return (
          <CredentialCard
            key={index}
            mode={mode}
            selected={selectedCredentials && selectedCredentials[credential.id]}
            onClick={() => onCredentialClick(credential)}
          >
            {selectedCredentials && selectedCredentials[credential.id] && (
              <PluginAdded>
                <Text color="accent" size="small">
                  Added
                </Text>
              </PluginAdded>
            )}
            <Box
              display="flex"
              flexDirection="row"
              gap="4"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Box width="1/4">
                <Image
                  src={credential.imageUri}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  alt="img"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                width="3/4"
              >
                <Text variant="large" weight="bold" align="left">
                  {credential.name}
                </Text>
              </Box>
            </Box>
          </CredentialCard>
        );
      })}
    </Box>
  );
};
