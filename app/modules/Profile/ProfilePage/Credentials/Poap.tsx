import { Credential, PoapCredential } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import styled from "styled-components";

type Props = {
  credentials: PoapCredential[];
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

const CircularStyledImage = styled.img`
  @media (max-width: 768px) {
    width: 4rem;
  }
  width: 6rem;
  border-radius: 20rem;
`;

const Poap = ({
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
          key={credential.tokenId}
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
      ))}
    </Box>
  );
};

export default Poap;
