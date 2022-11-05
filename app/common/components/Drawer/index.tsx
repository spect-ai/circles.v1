import { Box, Button, Heading, IconClose, Stack } from "degen";
import React from "react";
import styled from "styled-components";

type props = {
  children: React.ReactNode;
  title: string;
  handleClose: (...args: any[]) => void;
};

function Drawer({ handleClose, title, children }: props) {
  return (
    <Container backgroundColor="background" borderLeftWidth="0.375">
      <Box
        paddingX={{
          xs: "4",
          md: "8",
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
  );
}

const Container = styled(Box)`
  height: 100%;
  width: 70%;
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  transition: 0.5s;
  padding-top: 10px;
  display: flex;
  flex-direction: column;

  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 1024px) {
    width: 90%;
  }
`;

export default Drawer;

export type { props as DrawerProps };
