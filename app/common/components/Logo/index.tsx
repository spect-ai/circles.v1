import { Button, Avatar, Box } from "degen";
import Link from "next/link";
import styled from "styled-components";

type props = {
  href: string;
  src: string;
  gradient: string;
};

const Placeholder = styled(Box)<{ gradient: string }>`
  background: ${(props) => props.gradient};
  background-size: 180% 180%;
`;

export default function Logo({ href, src, gradient }: props) {
  return (
    <Link href={href || "/"} passHref>
      <Button shape="circle" variant="transparent" size="small">
        {src ? (
          <Avatar
            label="logo"
            src={src}
            size={{
              xs: "8",
              md: "10",
            }}
          />
        ) : (
          <Placeholder
            height={{
              xs: "8",
              md: "10",
            }}
            width={{
              xs: "8",
              md: "10",
            }}
            borderRadius="full"
            gradient={gradient}
          />
        )}
      </Button>
    </Link>
  );
}
