import { useGlobal } from "@/app/context/globalContext";
import { Box, Heading, Stack } from "degen";
import { useState } from "react";
import styled from "styled-components";
import ConnectModal from "../Sidebar/ProfileModal/ConnectModal";
import { Container } from "./CircleSidebar";
import CollapseButton from "./CollapseButton";

export const HeaderButton = styled(Box)`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgb(255, 255, 255, 0.05);
  }
`;

export default function ExploreSidebar() {
  const { connectedUser } = useGlobal();
  const [showCollapseButton, setShowCollapseButton] = useState(false);

  return (
    <Box
      padding="2"
      onMouseEnter={() => setShowCollapseButton(true)}
      onMouseLeave={() => setShowCollapseButton(false)}
      marginBottom="0.5"
    >
      <Stack>
        <HeaderButton padding="1" borderRadius="large" width="full">
          <Stack direction="horizontal" align="center">
            <Heading>Circles</Heading>
          </Stack>
        </HeaderButton>

        <Container>
          <CollapseButton
            show={showCollapseButton}
            setShowCollapseButton={setShowCollapseButton}
            top="0.8rem"
            left="21rem"
          />
          <Box marginTop="2" marginX="1">
            {!connectedUser && <ConnectModal />}
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
