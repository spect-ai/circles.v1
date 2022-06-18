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

const OptionContainer = styled(Box)`
  cursor: pointer;
  &:hover {
    border-color: rgb(175, 82, 222, 1);
  }
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
            padding="4"
            borderColor={value.value === val ? "accent" : "foregroundSecondary"}
            width="32"
          >
            <Text align="center">{label}</Text>
          </OptionContainer>
        ))}
      </Stack>
    </Box>
  );
};

export default Select;

export type { Props as SelectProps };
