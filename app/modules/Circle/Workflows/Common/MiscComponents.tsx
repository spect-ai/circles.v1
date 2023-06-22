import styled from "@emotion/styled";
import { Box, Text, useTheme } from "degen";

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  text: string;
  description: string;
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 20, 20, 0.05)"};
  }
  transition: background-color 0.2s ease-in-out;
`;

export const PopoverOption = ({
  onClick,
  text,
  description,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      mode={mode}
    >
      <Text ellipsis weight="semiBold">
        {text}
      </Text>
      <Text size="extraSmall" color="textTertiary">
        {description}
      </Text>
    </PopoverOptionContainer>
  );
};
