import type { FC } from "react";

import { Avatar, Box, Button, Text } from "degen";
import Link from "next/link";
import styled from "styled-components";

interface Props {
  title: string;
  href: string;
  avatar?: string;
}

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 8px rgb(255, 255, 255, 0.1);
    border-color: rgb(255, 255, 255, 0.4);
  }
`;

const Card: FC<Props> = ({ title, href, avatar }) => {
  return (
    <Link href={href} passHref>
      <Container
        borderWidth="0.375"
        padding="6"
        borderRadius="2xLarge"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginRight="8"
        marginBottom="8"
        height="60"
        transitionDuration="700"
      >
        <Box marginBottom="4">
          <Avatar
            label="Remy Sharp"
            src={avatar}
            placeholder={!avatar}
            size="20"
          />
        </Box>
        <Text color="textPrimary" size="large" letterSpacing="0.03" ellipsis>
          {/* {normalTrim(title, 17)} */}
          {title}
        </Text>
        <Box marginTop="4">
          <Button variant="tertiary" size="small">
            Follow
          </Button>
        </Box>
      </Container>
    </Link>
  );
};

export default Card;

export type { Props as CardProps };
