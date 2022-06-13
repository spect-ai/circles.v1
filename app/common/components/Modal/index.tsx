import { Box, Heading } from "degen";
import { motion } from "framer-motion";
import React from "react";

import styled from "styled-components";
import Backdrop from "./backdrop";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const Container = styled(Box)<{
  modalWidth?: string;
  modalHeight?: string;
}>`
  height: ${(props) => props.modalHeight || "40rem"};
  width: ${(props) => props.modalWidth || "60rem"};
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-bottom: 2rem;
`;

type props = {
  children: React.ReactNode;
  title: string;
  handleClose: () => void;
  modalWidth?: string;
  modalHeight?: string;
};

function Modal({
  handleClose,
  title,
  children,
  modalWidth,
  modalHeight,
}: props) {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Container
          backgroundColor="backgroundTertiary"
          borderWidth="0.375"
          borderRadius="extraLarge"
          modalWidth={modalWidth}
          modalHeight={modalHeight}
        >
          <Box borderBottomWidth="0.375" paddingX="8" paddingY="5">
            <Heading>{title}</Heading>
          </Box>
          {children}
        </Container>
      </motion.div>
    </Backdrop>
  );
}

export default Modal;

export type { props as ModalProps };
