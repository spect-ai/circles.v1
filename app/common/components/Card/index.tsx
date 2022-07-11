import type { FC } from "react";

import { Box } from "degen";
import styled from "styled-components";

interface Props {
  onClick: () => void;
  height: string | any;
  children: React.ReactNode;
  dashed?: boolean;
  tourId?: string;
}

const Container = styled(Box)<{ dashed: boolean }>`
  cursor: pointer;
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
  border-style: ${(props) => (props.dashed ? "dashed" : "solid")};
`;

const Card: FC<Props> = ({
  onClick,
  height,
  children,
  dashed = false,
  tourId,
}) => {
  return (
    <Container
      data-tour={tourId}
      borderWidth="0.5"
      padding={{ xs: "2", md: "4" }}
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
      backgroundColor="background"
      style={{
        borderColor: "rgb(255,255,255,0.02)",
      }}
    >
      {children}
    </Container>
  );
};

export default Card;

export type { Props as CardProps };
