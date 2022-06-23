import React, { useState } from "react";
import { Box, Text } from "degen";
import styled from "styled-components";

type Props = {
  onClick: () => void;
  name: string;
  icon?: React.ReactNode;
};

const TagContainer = styled(Box)`
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 0 0.4rem rgb(175, 82, 222, 0.28);
  }
`;

export default function ClickableTag({ name, icon, onClick }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <TagContainer
      backgroundColor={hover ? "accentSecondaryHover" : "accentSecondary"}
      borderRadius="3xLarge"
      paddingY="0.5"
      paddingX="2"
      fontWeight="medium"
      fontSize="small"
      display="flex"
      alignItems="center"
      width="fit"
      transitionDuration="300"
      onClick={onClick}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon}
      <Text>{name}</Text>
    </TagContainer>
  );
}
