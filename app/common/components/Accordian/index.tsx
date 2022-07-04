import { Box, IconChevronRight, Stack, Text } from "degen";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  name: string;
  children: React.ReactNode;
  defaultOpen: boolean;
  icon?: React.ReactNode;
};

function Accordian({ name, children, defaultOpen, icon }: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  return (
    <Box>
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        cursor="pointer"
        paddingY="4"
      >
        <Stack direction="horizontal" align="center" justify="space-between">
          <Text weight="medium" variant="label">
            <Stack direction="horizontal" align="center" space="2">
              {icon}
              {name}
            </Stack>
          </Text>
          <Box
            marginRight="2"
            transitionDuration="500"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <IconChevronRight color="textTertiary" size="5" />
          </Box>
        </Stack>
      </Box>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto" },
              collapsed: { height: 0 },
            }}
            transition={{ duration: 0.4 }}
            style={{
              overflowY: "hidden",
            }}
          >
            <Box>{children}</Box>
          </motion.section>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Accordian;

export type { Props as AccordianProps };
