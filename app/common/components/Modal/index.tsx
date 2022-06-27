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
      duration: 0.2,
    },
  },
};

const Container = styled(Box)<{
  modalWidth?: string;
  modalHeight?: string;
}>`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: ${(props) => props.modalHeight};
  margin-top: -5rem;
`;

type props = {
  children: React.ReactNode;
  title: string;
  handleClose: () => void;
  height?: string;
  size?: "small" | "medium" | "large";
  zIndex?: number;
};

const getResponsiveWidth = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { xs: "full", md: "128" };
    case "medium":
      return { xs: "full", md: "192" };
    case "large":
      return { xs: "full", md: "256" };
    default:
      return { xs: "full", md: "192" };
  }
};

function Modal({
  handleClose,
  title,
  children,
  height,
  size = "medium",
  zIndex,
}: props) {
  return (
    <Backdrop onClick={handleClose} zIndex={zIndex}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Container
          backgroundColor="background"
          borderWidth="0.375"
          borderRadius="2xLarge"
          width={getResponsiveWidth(size) as any}
          minHeight="48"
          modalHeight={height}
        >
          <Box
            borderBottomWidth="0.375"
            paddingX={{
              xs: "4",
              md: "8",
            }}
            paddingY={{
              xs: "2",
              md: "5",
            }}
          >
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
