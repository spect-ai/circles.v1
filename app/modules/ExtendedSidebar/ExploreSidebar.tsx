import { useGlobal } from "@/app/context/globalContext";
import { Box, Heading, Stack, useTheme } from "degen";
import { useState } from "react";
import styled from "styled-components";
import ConnectModal from "../Sidebar/ProfileModal/ConnectModal";
import { Container } from "./CircleSidebar";
import CollapseButton from "./CollapseButton";

export const HeaderButton = styled(Box)<{ mode: string }>`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

export default function ExploreSidebar() {
  const { connectedUser } = useGlobal();
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const { mode } = useTheme();

  return (
    <Box
      padding="2"
      onMouseEnter={() => setShowCollapseButton(true)}
      onMouseLeave={() => setShowCollapseButton(false)}
      marginBottom="0.5"
    >
      <Stack>
        <HeaderButton padding="1" borderRadius="large" width="full" mode={mode}>
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
