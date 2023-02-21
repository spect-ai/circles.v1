import type { FC } from "react";

import { Box, IconClose, Stack, Tag, Text } from "degen";
import styled from "styled-components";

export type option = {
  label: string;
  value: string;
};

interface Props {
  options: option[];
  value: option;
  onChange: (value: option) => void;
  variant?: "primary" | "secondary";
  canDelete?: boolean;
  onDelete?: (value: option) => void;
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
  justify-content: center;
`;

const Select: FC<Props> = ({
  options,
  value,
  onChange,
  variant = "primary",
  canDelete = false,
  onDelete,
}) => {
  return (
    <Box>
      <Stack direction="horizontal" wrap>
        {variant === "primary" &&
          options.map(({ label, value: val }) => (
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
              isSelected={value?.value === val}
              // borderColor={value.value === val ? "accent" : "foregroundSecondary"}
              width="32"
            >
              <Text weight="semiBold" align="center">
                {label}
              </Text>
            </OptionContainer>
          ))}
        {variant === "secondary" &&
          options?.map(({ label, value: val }) => (
            <Box
              key={val}
              onClick={() =>
                onChange({
                  label,
                  value: val,
                })
              }
              cursor="pointer"
            >
              <Tag hover tone={value?.value === val ? "accent" : undefined}>
                <Stack direction="horizontal" space="1" align="center">
                  {label}
                  {canDelete && (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.({
                          label,
                          value: val,
                        });
                      }}
                      cursor="pointer"
                    >
                      <IconClose size="4" color="red" />
                    </Box>
                  )}
                </Stack>
              </Tag>
            </Box>
          ))}
      </Stack>
    </Box>
  );
};

export default Select;

export type { Props as SelectProps };
