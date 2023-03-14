import type { FC } from "react";

import { smartTrim } from "@/app/common/utils/utils";
import { Avatar, Box, Stack, Text } from "degen";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

interface Props {
  href: string;
  gradient: string;
  logo: string;
  name: string;
  description: string;
}

const Container = styled(Box)`
  border: 0.1rem solid transparent;
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
          {logo || name ? (
            <Avatar
              src={
                logo ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${name}&backgroundType=gradientLinear&fontFamily=sans-serif`
              }
              size="24"
              label=""
            />
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
          <Text weight="semiBold" variant="large" ellipsis>
            {smartTrim(name, 18)}
          </Text>
          <Text align="center" variant="label">
            {smartTrim(description, 80)}
          </Text>
        </Stack>
      </Container>
    </Link>
  );
};

export default CircleCard;

export type { Props as CardProps };
