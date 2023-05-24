import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Heading, Stack, useTheme, Text } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Container } from "./CircleSidebar";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  const { mode } = useTheme();
  const router = useRouter();
  const { openConnectModal } = useConnectModal();

  return (
    <Box padding="2" marginBottom="0.5">
      <Stack>
        <HeaderButton padding="1" borderRadius="large" width="full" mode={mode}>
          <Stack direction="horizontal" align="center">
            <Heading>Spect</Heading>
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
            {!currentUser?.id && (
              <PrimaryButton onClick={openConnectModal}>Sign In</PrimaryButton>
            )}
          </Box>
          <Box display={"flex"} flexDirection="column" gap="2" paddingX={"2"}>
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
          </Box>
        </Container>
      </Stack>
    </Box>
  );
}
