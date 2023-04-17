import { Box, Button, Heading, IconClose, Stack } from "degen";
import React from "react";
import Draggable from "react-draggable";
import { Hidden } from "react-grid-system";
import styled from "styled-components";

type Props = {
  handleClose: () => void;
  src: string;
  height?: string;
  width?: string;
};

export default function ScribeEmbed({
  handleClose,
  src,
  height = "640",
  width = "450",
}: Props) {
  return (
    <Hidden xs sm md>
      <Draggable>
        <Container
          padding="4"
          backgroundColor="foregroundSecondary"
          borderRadius="2xLarge"
        >
          <Stack direction="horizontal" justify="space-between">
            <Heading>Walkthrough</Heading>
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => handleClose()}
            >
              <IconClose />
            </Button>
          </Stack>
          <iframe
            src={src}
            width={width}
            height={height}
            allowFullScreen
            frameBorder="0"
          ></iframe>
        </Container>
      </Draggable>
    </Hidden>
  );
}

const Container = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: move;
  z-index: 2147483900;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
`;
