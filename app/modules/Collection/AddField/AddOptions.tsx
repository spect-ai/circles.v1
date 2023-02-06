import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconClose, Stack, Text, useTheme } from "degen";
import React from "react";
import styled from "styled-components";
import uuid from "react-uuid";

type Props = {
  fieldOptions: { label: string; value: string }[];
  setFieldOptions: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  label?: string;
  disabled?: boolean;
  setCardOrder?: (cardOrder: string[][]) => void;
  cardOrder?: string[][];
};

export default function AddOptions({
  fieldOptions,
  setFieldOptions,
  label = "Options",
  disabled,
  setCardOrder,
  cardOrder,
}: Props) {
  const { mode } = useTheme();
  return (
    <Box maxHeight="56" overflow="auto">
      <Stack>
        <Text variant="label">{label}</Text>
        {fieldOptions.map((option, index) => (
          <Box key={index}>
            <Stack direction="horizontal" align="center">
              <OptionInput
                value={option.label}
                onChange={(e) => {
                  const newOptions = [...fieldOptions];
                  newOptions[index].label = e.target.value;
                  setFieldOptions(newOptions);
                }}
                mode={mode}
              />
              {!disabled && (
                <Box
                  cursor="pointer"
                  onClick={() => {
                    if (cardOrder && setCardOrder) {
                      const newCardOrder = [...cardOrder];
                      // apend all the elements from the array index to the 0th index
                      newCardOrder[0] = [
                        ...newCardOrder[0],
                        ...newCardOrder[index + 1],
                      ];
                      // delete the array index
                      newCardOrder.splice(index + 1, 1);
                      setCardOrder(newCardOrder);
                    }
                    const newOptions = [...fieldOptions];
                    newOptions.splice(index, 1);
                    setFieldOptions(newOptions);
                  }}
                >
                  <IconClose color="accent" size="4" />
                </Box>
              )}
            </Stack>
          </Box>
        ))}
        {!fieldOptions.length && (
          <Text variant="label">No options added yet</Text>
        )}
        {!disabled && (
          <Box padding="1" width="1/2">
            <PrimaryButton
              variant="tertiary"
              onClick={() => {
                const newOptions = [...fieldOptions];
                newOptions.push({
                  label: `Option ${fieldOptions.length + 1}`,
                  value: `option-${uuid()}`,
                });
                setFieldOptions(newOptions);

                if (cardOrder && setCardOrder) {
                  const newCardOrder = [...cardOrder];
                  newCardOrder.push([]);
                  setCardOrder(newCardOrder);
                }
              }}
            >
              Add Option
            </PrimaryButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

const OptionInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.8)" : "rgb(20, 20, 20, 0.8)"};
  font-weight: 500;
`;
