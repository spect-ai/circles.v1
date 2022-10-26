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
        variants={grow}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Container
          backgroundColor="background"
          // borderWidth="0.375"
          borderRadius="2xLarge"
          width={getResponsiveWidth(size) as any}
          minHeight="48"
          modalHeight={height}
          // style={{
          //   backgroundColor: "rgba(21,20,21,255)",
          // }}
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
