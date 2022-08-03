import { smartTrim } from "@/app/common/utils/utils";
import { UserType } from "@/app/types";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import QuickProfilePanel from "../../Profile/QuickProfilePanel";
import { useGlobal } from "@/app/context/globalContext";

const Container = styled(Box)<{ mode: string }>`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  }
`;

export default function ProfileButton() {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { openQuickProfile, isProfilePanelExpanded } = useGlobal()
  const { mode } = useTheme();
  return (
    <>
      <Box borderTopWidth="0.375" paddingTop="2" marginX="4">
        <Container
          onClick={()=> openQuickProfile((currentUser as UserType).id)}
          data-tour="profile-header-button"
          padding="1"
          borderRadius="large"
          width="full"
          mode={mode}
        >
          <Stack direction="horizontal">
            <Stack space="1">
              <Text>{currentUser?.username}</Text>
              <Text size="small" variant="label">
                {smartTrim(currentUser?.ethAddress as string, 12)}
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <AnimatePresence>
        {isProfilePanelExpanded && <QuickProfilePanel/>} 
      </AnimatePresence>
    </>
  );
}
