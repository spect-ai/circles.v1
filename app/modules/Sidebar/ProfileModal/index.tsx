import { smartTrim } from "@/app/common/utils/utils";
import { useGlobal } from "@/app/context/globalContext";
import { UserType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useDisconnect } from "wagmi";
import ProfileModal from "./ProfileModal";

const Container = styled(Box)`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgb(255, 255, 255, 0.05);
  }
`;

export default function ProfileButton() {
  const { disconnect } = useDisconnect();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { disconnectUser } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Box borderTopWidth="0.375" paddingTop="2" marginX="4">
        <Container
          onClick={() => setIsOpen(true)}
          data-tour="profile-header-button"
          padding="1"
          borderRadius="large"
          width="full"
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
        {isOpen && <ProfileModal setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </>
  );
}
