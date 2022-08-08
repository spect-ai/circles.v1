import type { FC } from "react";

import { Box, Stack, Text } from "degen";
import styled from "styled-components";

export type option = {
  label: string;
  value: string;
};

interface Props {
  options: option[];
  value: option;
  onChange: (value: option) => void;
}

const OptionContainer = styled(Box)<{ isSelected: boolean }>`
  cursor: pointer;
  border-color: ${({ isSelected }) =>
    isSelected ? "rgb(191, 90, 242, 1)" : "accent"};
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Select: FC<Props> = ({ options, value, onChange }) => {
  return (
    <Box>
      <Stack direction="horizontal" wrap>
        {options.map(({ label, value: val }) => (
          <OptionContainer
            key={val}
            onClick={() =>
              onChange({
                label,
                value: val,
              })
            }
            borderWidth="0.5"
            transitionDuration="500"
            borderRadius="2xLarge"
            padding="2"
            isSelected={value.value === val}
            // borderColor={value.value === val ? "accent" : "foregroundSecondary"}
            width="32"
          >
            <Text align="center" weight="semiBold">
              {label}
            </Text>
          </OptionContainer>
        ))}
      </Stack>
    </Box>
  );
};

export default Select;

export type { Props as SelectProps };
