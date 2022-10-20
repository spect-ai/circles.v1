import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Heading, Stack, useTheme } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { Container } from "./CircleSidebar";
import CollapseButton from "./CollapseButton";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const HeaderButton = styled(Box)<{ mode: string }>`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

export default function ExploreSidebar() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [showCollapseButton, setShowCollapseButton] = useState(false);
  const { mode } = useTheme();
  const router = useRouter();
  const { openConnectModal } = useConnectModal();

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
            {currentUser?.id && (
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
            {currentUser?.id && (
              <Stack key="Profile" direction="horizontal" space="0">
                {/* <Box borderRightWidth="0.5" /> */}
                <Box width="full" padding="1">
                  <Link
                    href={`/profile/${currentUser?.username}`}
                    key="Profile"
                  >
                    <PrimaryButton
                      variant={
                        router.query?.user === currentUser?.username
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
            {!currentUser?.id && (
              <PrimaryButton onClick={openConnectModal}>
                Connect Wallet
              </PrimaryButton>
            )}
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
