import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Text } from "degen";

type Props = {
  onClick: () => void;
  name: string;
  tone: string;
  icon?: React.ReactNode;
};

export default function ClickableTag({ name, icon, tone, onClick }: Props) {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0rem",
        width: "100%",
        display: "flex",
      }}
    >
      <Box
        backgroundColor={tone as any}
        borderRadius="3xLarge"
        paddingY="0.5"
        paddingX="2"
        fontWeight="medium"
        fontSize="small"
        display="flex"
        alignItems="center"
      >
        {icon}
        <Text>{name}</Text>
      </Box>
    </motion.button>
  );
}
