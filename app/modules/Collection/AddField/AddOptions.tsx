import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconClose, Input, Stack, Text, useTheme } from "degen";
import React from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  fieldOptions: { label: string; value: string }[];
  setFieldOptions: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  label?: string;
  disabled?: boolean;
  setCardOrder?: (cardOrder: string[][]) => void;
  cardOrder?: string[][];
  maxSelections?: number;
  setMaxSelections: (maxSelections: number) => void;
  allowCustom: boolean;
  setAllowCustom: (allowCustom: boolean) => void;
  multiSelect?: boolean;
};

export default function AddOptions({
  fieldOptions,
  setFieldOptions,
  label = "Options",
  disabled,
  setCardOrder,
  cardOrder,
  maxSelections,
  setMaxSelections,
  allowCustom,
  setAllowCustom,
  multiSelect,
}: Props) {
  const { mode } = useTheme();
  const { localCollection: collection } = useLocalCollection();
  return (
    <Box maxHeight="56" overflow="auto">
      <Stack>
        {collection.collectionType === 0 && (
          <Stack>
            <Text variant="label">Settings</Text>
            <Stack direction="horizontal" align="center" space="2">
              <input
                type="checkbox"
                name={"Settings"}
                checked={allowCustom}
                onChange={() => {
                  setAllowCustom(!allowCustom);
                }}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <Text size="small" weight="light">
                Allow custom answer
              </Text>
            </Stack>
            {multiSelect && (
              <Box marginTop="-2" marginRight="8">
                <Input
                  label=""
                  type="number"
                  value={maxSelections}
                  onChange={(e) => {
                    setMaxSelections(parseInt(e.target.value));
                  }}
                  placeholder="Max number of selections allowed"
                  min={2}
                  units="max selections"
                />
              </Box>
            )}
          </Stack>
        )}
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
