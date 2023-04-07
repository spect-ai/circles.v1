import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { VerifiableCredential, Credential } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import styled from "styled-components";

type Props = {
  credentials: Credential[];
  selectedCredentials: { [id: string]: boolean };
  onCredentialClick: (credential: Credential) => void;
};

const CredentialCard = styled(Box)<{ mode: string; selected: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.selected
        ? "rgb(191, 90, 242, 1)"
        : props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
`;

const PluginAdded = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0 1rem 0 1rem;
`;

const GitcoinPassport = ({
  credentials,
  selectedCredentials,
  onCredentialClick,
}: Props) => {
  const { mode } = useTheme();

  if (!credentials?.length) {
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
  }
  return (
    <Box>
      {credentials?.map((credential) => (
        <CredentialCard
          key={credential.id}
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
      ))}
    </Box>
  );
};

export default GitcoinPassport;
