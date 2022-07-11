import type { FC } from "react";

import { Avatar, Box, Stack, Text } from "degen";
import styled, { keyframes } from "styled-components";
import Link from "next/link";

interface Props {
  href: string;
  gradient: string;
  logo: string;
  name: string;
  description: string;
}

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;

const GradientAnimation = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`;

const Cover = styled(Box)<{ gradient: string }>`
  background: ${(props) => props.gradient};
  opacity: 0.7;
  background-size: 180% 180%;
  animation: ${GradientAnimation} 9s ease infinite;
`;

const LogoContainer = styled(Box)`
  margin-top: -40px;
  z-index: 0;
`;

const Placeholder = styled(Box)<{ gradient: string }>`
  background: ${(props) => props.gradient};
  background-size: 180% 180%;
`;

const CircleCard: FC<Props> = ({ href, gradient, logo, name, description }) => {
  return (
    <Link href={href}>
      <Container
        borderWidth="0.5"
        borderRadius="2xLarge"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginRight={{ xs: "2", md: "4" }}
        marginBottom={{ xs: "4", md: "8" }}
        transitionDuration="700"
        backgroundColor="background"
        height="72"
      >
        <Cover
          height="24"
          width="full"
          borderTopRadius="2xLarge"
          gradient={gradient}
        />
        <LogoContainer marginBottom="4">
          {logo ? (
            <Avatar src={logo} size="24" label="" />
          ) : (
            <Placeholder
              height="24"
              width="24"
              borderRadius="full"
              gradient={gradient}
            />
          )}
        </LogoContainer>
        <Stack align="center">
          <Text weight="semiBold" variant="large">
            {name}
          </Text>
          <Text align="center" variant="label">
            {description}
          </Text>
        </Stack>
      </Container>
    </Link>
  );
};

export default CircleCard;

export type { Props as CardProps };
