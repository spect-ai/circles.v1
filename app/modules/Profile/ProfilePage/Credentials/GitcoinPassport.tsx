import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { VerifiableCredential, Credential } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { CredentialCard, PluginAdded } from "../LinkCredentialsModal";
type Props = {
  credentials: Credential[];
  selectedCredentials: { [id: string]: boolean };
  onCredentialClick: (credential: Credential) => void;
};

export const GitcoinPassport = ({
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
            <Box display="flex" flexDirection="row" gap="4" alignItems="center">
              <Box
                width="8"
                height="8"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {mode === "dark"
                  ? PassportStampIcons[
                      (credential?.metadata as VerifiableCredential)
                        ?.providerName as keyof typeof PassportStampIconsLightMode
                    ]
                  : PassportStampIconsLightMode[
                      (credential?.metadata as VerifiableCredential)
                        ?.providerName as keyof typeof PassportStampIconsLightMode
                    ]}
              </Box>
              <Box display="flex" flexDirection="column">
                <Text variant="large" weight="semiBold">
                  {credential.name}
                </Text>
                <Text variant="small">{credential.description}</Text>
                <Text variant="small">
                  Issued By{" "}
                  {(credential.metadata as VerifiableCredential)?.providerName}
                </Text>
              </Box>
            </Box>
          </CredentialCard>
        );
      })}
    </Box>
  );
};
