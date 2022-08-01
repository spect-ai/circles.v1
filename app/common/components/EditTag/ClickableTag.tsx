import React, { useState } from "react";
import { Box, Text, useTheme } from "degen";
import styled from "styled-components";

type Props = {
  onClick: () => void;
  name: string;
  icon?: React.ReactNode;
  tourId?: string;
};

const TagContainer = styled(Box)<{ mode: string }>`
  &:hover {
    cursor: pointer;
    // box-shadow: 0 0 0 0.4rem rgb(191, 90, 242, 0.2);
    box-shadow: 0 0 0 0.3rem
      ${({ mode }) =>
        mode === "dark"
          ? "rgb(191, 90, 242, 0.26)"
          : "rgb(191, 90, 242, 0.21)"};
  }
`;

export default function ClickableTag({ name, icon, onClick, tourId }: Props) {
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();
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
      mode={mode}
    >
      {icon}
      <Text>{name}</Text>
    </TagContainer>
  );
}
