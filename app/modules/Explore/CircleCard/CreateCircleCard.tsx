import type { FC } from "react";

import { Avatar, Box, Button, Stack, Text } from "degen";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useGlobal } from "@/app/context/globalContext";
import CreateCircle from "../../Sidebar/CreateCircleModal";

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

const LogoContainer = styled(Box)`
  margin-top: -40px;
  z-index: 0;
`;

const Placeholder = styled(Box)<{ gradient: string }>`
  background: ${(props) => props.gradient};
  background-size: 180% 180%;
`;

const CreateCircleCard = () => {
  const { connectedUser } = useGlobal();
  return <Button>{connectedUser && <CreateCircle />}</Button>;
};

export default CreateCircleCard;
