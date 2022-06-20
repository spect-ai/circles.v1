import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Box, Tag, Text } from "degen";
import styled from "styled-components";

type Props = {
  member: string;
  memberDetails: any;
  handleOnClick: (event: any, mem: string) => void;
};

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    border-color: rgb(175, 82, 222, 1);
  }
`;

export default function MemberDisplay({
  member,
  memberDetails,
  handleOnClick,
}: Props) {
  console.log({ member, memberDetails });
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
