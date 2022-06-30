import Logo from "@/app/common/components/Logo";
import { UserType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
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

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

export default function ExploreSidebar() {
  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void refetch();
  }, []);

  return (
    <Box padding="2">
      <Stack>
        <HeaderButton padding="1" borderRadius="large" width="full">
          <Stack direction="horizontal" align="center" space="1">
            <Logo
              href="/"
              src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
            />
            <Text
              size="extraLarge"
              weight="semiBold"
              color="textPrimary"
              ellipsis
            >
              Circles
            </Text>
          </Stack>
        </HeaderButton>
        <Container>{!currentUser?.id && <ConnectModal />}</Container>
      </Stack>
    </Box>
  );
}
