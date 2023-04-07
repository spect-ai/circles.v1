import { Box, useTheme } from "degen";
import React from "react";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
};

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
  @media (max-width: 768px) {
    justify-content: flex-end;
    align-items: flex-end;
  }

  justify-content: center;
  align-items: center;
`;

const Backdrop = ({ children, onClick, zIndex }: Props) => {
  const { mode } = useTheme();
  return (
    <Container zindex={zIndex as number} mode={mode} onClick={onClick}>
      {children}
    </Container>
  );
};

export default Backdrop;
