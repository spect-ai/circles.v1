import React, { useState } from "react";
import { Box, Text } from "degen";
import styled from "styled-components";

type Props = {
  onClick: () => void;
  name: string;
  icon?: React.ReactNode;
  tourId?: string;
};

const TagContainer = styled(Box)`
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 0 0.4rem rgb(191, 90, 242, 0.25);
  }
`;

export default function ClickableTag({ name, icon, onClick, tourId }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <TagContainer
      data-tour={tourId}
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
