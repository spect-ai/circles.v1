import { Box, useTheme } from "degen";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

type props = {
  children: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
};

function Backdrop({ children, onClick, zIndex }: props) {
  const { mode } = useTheme();
  return (
    <motion.div onClick={onClick} id="backdrop">
      <Container zindex={zIndex as number} mode={mode}>
        {children}
      </Container>
    </motion.div>
  );
}

const Container = styled(Box)<{ zindex: number; mode: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ mode }) =>
    mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0,0,0,0.1)"};
  display: flex;

  z-index: ${(props) => props.zindex || 1};
  // backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    justify-content: flex-end;
    align-items: flex-end;
  }

  justify-content: center;
  align-items: center;
`;

export default Backdrop;
