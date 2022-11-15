import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Heading, Stack, useTheme, Text, IconDotsHorizontal } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { Container } from "./CircleSidebar";
import CollapseButton from "./CollapseButton";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Popover from "@/app/common/components/Popover";

const PopoverScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 14rem;
  overflow-y: auto;
`;

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    // background-color: rgba(255, 255, 255, 0.1);
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

export const PopoverOption = ({
  children,
  onClick,
  tourId,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

        <Container
          justifyContent={"space-between"}
          subH="9.2rem"
          display={"flex"}
          flexDirection="column"
        >
          {/* <CollapseButton
            show={showCollapseButton}
            setShowCollapseButton={setShowCollapseButton}
            top="0.8rem"
            left="2rem"
          /> */}
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
          <Box display={"flex"} flexDirection="column" gap="2" paddingX={"2"}>
            <PrimaryButton
              onClick={() => {
                window.open(
                  "https://calendly.com/adityachakra16/outreach",
                  "_blank"
                );
              }}
            >
              Book a Demo
            </PrimaryButton>
            <PrimaryButton
              variant="transparent"
              onClick={() => {
                window.open(
                  "https://docs.spect.network/spect-docs/faq",
                  "_blank"
                );
              }}
            >
              FAQ
            </PrimaryButton>
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
