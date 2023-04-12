import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { VerifiableCredential, Credential, PoapCredential } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { CredentialCard, PluginAdded } from "../LinkCredentialsModal";
import Image from "next/image";
import styled from "styled-components";

type Props = {
  credentials: PoapCredential[];
  selectedCredentials: { [id: string]: boolean };
  onCredentialClick: (credential: Credential) => void;
};

export const Poap = ({
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
            selected={
              selectedCredentials && selectedCredentials[credential.tokenId]
            }
            onClick={() =>
              onCredentialClick({
                id: credential.tokenId,
                imageUri: credential.event.image_url,
                name: credential.event.name,
                description: credential.event.description,
                type: "poap",
                service: "poap",
              })
            }
          >
            {selectedCredentials && selectedCredentials[credential.tokenId] && (
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
                <CircularStyledImage
                  src={`${credential?.event.image_url}`}
                  alt="poap"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                width="3/4"
              >
                <Text variant="large" weight="bold" align="left">
                  {credential.event.name}
                </Text>
              </Box>
            </Box>
          </CredentialCard>
        );
      })}
    </Box>
  );
};

const CircularStyledImage = styled.img`
  @media (max-width: 768px) {
    width: 4rem;
  }
  width: 6rem;
  border-radius: 20rem;
`;
