import { Box, IconChevronRight, Text } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  name: string;
  children: React.ReactNode;
  defaultOpen: boolean;
  buttonComponent?: React.ReactNode;
  showButton?: boolean;
};

const CollapseButton = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  background: transparent;
  border: none;
  text-transform: uppercase;
  cursor: pointer;
  align-items: center;
  letter-spacing: 0.5px;
  //   color: rgba(255, 255, 255, 0.35);
  //   font-weight: semi-bold;
  padding: 0.5rem 0rem;
`;

function Accordian({
  name,
  children,
  defaultOpen,
  buttonComponent,
  showButton = true,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <CollapseButton onClick={() => setIsExpanded(!isExpanded)}>
          <Box
            marginRight="2"
            transitionDuration="700"
            style={{
              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <IconChevronRight color="textTertiary" size="5" />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            width="full"
            alignItems="center"
            paddingRight="1"
          >
            <Text weight="medium" color="textTertiary">
              {name}
            </Text>
          </Box>
        </CollapseButton>
        {showButton && buttonComponent}
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
