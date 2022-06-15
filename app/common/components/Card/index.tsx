import type { FC } from "react";

import { Box } from "degen";
import styled from "styled-components";

interface Props {
  onClick: () => void;
  height: string | any;
  children: React.ReactNode;
  dashed?: boolean;
}

const Container = styled(Box)<{ dashed: boolean }>`
  cursor: pointer;
  &:hover {
    border-color: rgb(175, 82, 222, 1);
  }
  border-style: ${(props) => (props.dashed ? "dashed" : "solid")};
`;

const Card: FC<Props> = ({ onClick, height, children, dashed = false }) => {
  return (
    <Container
      borderWidth="0.5"
      padding={{ xs: "4", md: "8" }}
      borderRadius="2xLarge"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginRight={{ xs: "2", md: "4" }}
      marginBottom={{ xs: "4", md: "8" }}
      height={height}
      transitionDuration="700"
      dashed={dashed}
      onClick={onClick}
    >
      {children}
    </Container>
  );
};

export default Card;

export type { Props as CardProps };
