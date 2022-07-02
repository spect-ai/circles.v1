import Logo from "@/app/common/components/Logo";
import { useGlobalContext } from "@/app/context/globalContext";
import { Box, Stack, Text } from "degen";
import styled from "styled-components";
import ConnectModal from "../Header/ConnectModal";
import { Container } from "./CircleSidebar";

export const HeaderButton = styled(Box)`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgb(255, 255, 255, 0.1);
  }
`;

export default function ExploreSidebar() {
  const { connectedUser } = useGlobalContext();
  return (
    <Box padding="2">
      <Stack>
        <HeaderButton padding="1" borderRadius="large" width="full">
          <Stack direction="horizontal" align="center">
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
            />
            <Text weight="semiBold" size="headingTwo" ellipsis>
              Circles
            </Text>
          </Stack>
        </HeaderButton>
        <Container>
          <Box marginTop="2" marginX="1">
            {!connectedUser && <ConnectModal />}
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
