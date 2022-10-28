import { Box } from "degen";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

type props = {
  children: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
};

function Backdrop({ children, onClick, zIndex }: props) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>{children}</Container>
    </motion.div>
  );
}

const Container = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;

  z-index: 1000;
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    justify-content: flex-end;
    align-items: flex-end;
  }

  justify-content: center;
  align-items: center;
`;

export default Backdrop;
