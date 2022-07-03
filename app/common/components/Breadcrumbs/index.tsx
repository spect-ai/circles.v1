import type { FC } from "react";

import { Box, Stack, Text } from "degen";
import Link from "next/link";
import styled from "styled-components";

interface Props {
  crumbs: {
    name: string;
    href: string;
  }[];
}

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Breadcrumbs: FC<Props> = ({ crumbs }) => {
  return (
    <Box>
      <Stack direction="horizontal" space="2">
        {crumbs.map((crumb, index) => (
          <Stack direction="horizontal" space="2" key={index}>
            <Container href={crumb.href}>
              <Text>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.name}</Link>
                ) : (
                  crumb.name
                )}
              </Text>
            </Container>

            {index !== crumbs.length - 1 && <Text>/</Text>}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default Breadcrumbs;

export type { Props as BreadcrumbsProps };
