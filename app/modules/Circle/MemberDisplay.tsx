import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Box, Tag, Text } from "degen";

type Props = {
  member: string;
  memberDetails: any;
  handleOnClick: (event: any, mem: string) => void;
};

export default function MemberDisplay({
  member,
  memberDetails,
  handleOnClick,
}: Props) {
  console.log({ member, memberDetails });
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0rem",
      }}
    >
      <Box
        paddingY="1"
        paddingX="4"
        display="flex"
        borderWidth="0.375"
        borderRadius="3xLarge"
        alignItems="center"
        marginRight="2"
        marginTop="2"
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
      </Box>
    </motion.button>
  );
}
