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
  size?: "small" | "medium" | "large";
};

const getResponsiveWidth = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { xs: "full", md: "128" };
    case "medium":
      return { xs: "full", md: "192" };
    case "large":
      return { xs: "full", md: "224" };
    default:
      return { xs: "full", md: "192" };
  }
};

function Modal({ handleClose, title, children, size = "medium" }: props) {
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
          width={getResponsiveWidth(size) as any}
          minHeight="48"
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
