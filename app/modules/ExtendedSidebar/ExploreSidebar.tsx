import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { Box, Heading, Stack, useTheme } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import ConnectModal from "../Sidebar/ProfileButton/ConnectModal";
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
  const router = useRouter();
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
            {connectedUser && (
              <Stack key="Dashboard" direction="horizontal" space="0">
                {/* <Box borderRightWidth="0.5" /> */}
                <Box width="full" padding="1">
                  <Link href={`/`} key="Dashboard">
                    <PrimaryButton
                      variant={
                        Object.keys(router.query)?.length === 0
                          ? "tertiary"
                          : "transparent"
                      }
                    >
                      Dashboard
                    </PrimaryButton>
                  </Link>
                </Box>
              </Stack>
            )}
            {connectedUser && (
              <Stack key="Profile" direction="horizontal" space="0">
                {/* <Box borderRightWidth="0.5" /> */}
                <Box width="full" padding="1">
                  <Link href={`/profile/${connectedUser}`} key="Profile">
                    <PrimaryButton
                      variant={
                        router.query?.user === connectedUser
                          ? "tertiary"
                          : "transparent"
                      }
                    >
                      Profile
                    </PrimaryButton>
                  </Link>
                </Box>
              </Stack>
            )}
            {!connectedUser && <ConnectModal />}
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
