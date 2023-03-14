/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconChevronRight, Stack } from "degen";
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export const slideHorizontal = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: "0%",
    transition: {
      duration: 0.8,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.8,
    },
  },
};

type props = {
  children: React.ReactNode;
  handleClose: (...args: any[]) => void;
  header?: React.ReactNode;
  width?: string;
  closeOnOutsideClick?: boolean;
};

function Drawer({
  handleClose,
  children,
  header,
  width = "50%",
  closeOnOutsideClick,
}: props) {
  return (
    <Box
      style={{
        top: 0,
        right: 0,
        width: `${closeOnOutsideClick ? "100%" : width}`,
        height: "100%",
        position: "fixed",
        alignItems: "flex-end",
        zIndex: 2,
      }}
      onClick={() => {
        closeOnOutsideClick && handleClose();
      }}
    >
      <MotionContainer
        variants={slideHorizontal}
        initial="hidden"
        animate="visible"
        exit="exit"
        width={width}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Container backgroundColor="background">
          <Box
            paddingX={{
              xs: "4",
              md: "8",
            }}
          >
            {header ? (
              header
            ) : (
              <Box marginLeft="-4">
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => handleClose()}
                >
                  <Stack direction="horizontal" align="center" space="0">
                    <IconChevronRight />
                    <Box marginLeft="-4">
                      <IconChevronRight />
                    </Box>
                  </Stack>
                </Button>
              </Box>
            )}
          </Box>
          {children}
        </Container>
      </MotionContainer>
    </Box>
  );
}

const Container = styled(Box)`
  height: 100%;
  padding-top: 10px;
  // @media (max-width: 768px) {
  //   width: 100%;
  // }
  // @media (max-width: 1024px) {
  //   width: 90%;
  // }
`;

export const MotionContainer = styled(motion.div)<{ width?: string }>`
  height: 100%;
  width: ${({ width }) => width || "70%"};
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 75%;
  }
`;

export default Drawer;

export type { props as DrawerProps };
