import type { FC } from "react";

import { Box } from "degen";
import Link from "next/link";
import styled from "styled-components";

interface Props {
  href: string;
  height: string;
  children: React.ReactNode;
}

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 8px rgb(175, 82, 222, 1);
    border-color: rgb(175, 82, 222, 1);
  }
`;

const Card: FC<Props> = ({ href, height, children }) => {
  return (
    <Link href={href} passHref>
      <Container
        borderWidth="0.375"
        padding={{ xs: "4", md: "8" }}
        borderRadius="2xLarge"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginRight={{ xs: "4", md: "8" }}
        marginBottom={{ xs: "4", md: "8" }}
        height={height as any}
        transitionDuration="700"
      >
        {children}
      </Container>
    </Link>
  );
};

export default Card;

export type { Props as CardProps };
