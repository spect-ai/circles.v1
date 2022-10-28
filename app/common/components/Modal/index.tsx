import { Box, Button, Heading, IconClose, Stack } from "degen";
import { motion } from "framer-motion";
import React from "react";

import styled from "styled-components";
import Backdrop from "./backdrop";

// grow animation from center of screen
export const grow = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      type: "spring",
      damping: 25,
      stiffness: 400,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// slide up animation from bottom of screen
export const slideUp = {
  hidden: {
    y: "100%",
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    y: "100%",
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
  height: ${(props) => props.modalHeight};
  max-height: 90vh;
`;

type props = {
  children: React.ReactNode;
  title: string;
  // function with any arguments
  handleClose: (...args: any[]) => void;
  height?: string;
  size?: "small" | "medium" | "large";
  zIndex?: number;
};

const getResponsiveWidth = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return "128";
    case "medium":
      return "192";
    case "large":
      return "256";
    default:
      return "192";
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
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Container
          backgroundColor="background"
          borderRadius={{
            xs: "none",
            md: "2xLarge",
          }}
          borderTopRadius="2xLarge"
          width={{
            xs: "full",
            md: size ? getResponsiveWidth(size) : "192",
          }}
          minHeight="48"
          modalHeight={height}
        >
          <Box
            paddingX={{
              xs: "4",
              md: "8",
            }}
            paddingTop={{
              xs: "2",
              md: "5",
            }}
          >
            <Stack direction="horizontal" justify="space-between">
              <Heading>{title}</Heading>
              <Button
                shape="circle"
                size="small"
                variant="transparent"
                onClick={() => handleClose()}
              >
                <IconClose />
              </Button>
            </Stack>
          </Box>
          {children}
        </Container>
      </motion.div>
    </Backdrop>
  );
}

export default Modal;

export type { props as ModalProps };
