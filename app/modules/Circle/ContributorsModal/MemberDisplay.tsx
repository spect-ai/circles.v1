import React from "react";
import { Avatar, Box, Text } from "degen";
import styled from "styled-components";
import { UserType } from "@/app/types";

type Props = {
  member: string;
  memberDetails:
    | {
        [id: string]: UserType;
      }
    | undefined;
};

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;

export default function MemberDisplay({ member, memberDetails }: Props) {
  if (!memberDetails) {
    return null;
  }
  return (
    <Container
      paddingY="1"
      paddingX="4"
      display="flex"
      borderWidth="0.5"
      borderRadius="3xLarge"
      alignItems="center"
      marginRight="2"
      marginTop="2"
      transitionDuration="700"
    >
      <Avatar
        src={memberDetails[member]?.avatar}
        placeholder={!memberDetails[member]?.avatar}
        label="Avatar"
        size="7"
      />
      <Box marginLeft="2">
        <Text>{memberDetails[member]?.username}</Text>
      </Box>
    </Container>
  );
}
