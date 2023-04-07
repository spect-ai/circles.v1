import { Button, Avatar, Box, BoxProps } from "degen";
import Link from "next/link";
import styled from "styled-components";

type Props = {
  href: string;
  src: string;
  gradient: string;
  name?: string;
  size?: BoxProps["height"];
};

const Placeholder = styled(Box)<{ gradient: string }>`
  background: ${(props) => props.gradient};
  background-size: 180% 180%;
`;

const Logo = ({ href, src, gradient, name, size }: Props) => (
  <Link href={href || "/"} passHref>
    <Button shape="circle" variant="transparent" size="small">
      {src || name ? (
        <Avatar
          label="logo"
          src={
            src ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${name}&backgroundType=gradientLinear`
          }
          size={
            size || {
              xs: "8",
              md: "10",
            }
          }
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

export default Logo;
