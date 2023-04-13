import { Box, Button, IconClose, Input, Stack, Text, useTheme } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import ColorPicker from "react-best-gradient-color-picker";
import Popover from "@/app/common/components/Popover";
import { motion } from "framer-motion";

type Props = {
  fieldOptions: { label: string; value: string; color?: string }[];
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
  setIsDirty?: (isDirty: boolean) => void;
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
  setIsDirty,
}: Props) {
  const { mode } = useTheme();
  const { localCollection: collection } = useLocalCollection();
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [editColorForOption, setEditColorForOption] = useState(-1);
  const [colorPickerColor, setColorPickerColor] = useState("#000000");

  return (
    <Box maxHeight="56" overflow="auto">
      <Stack>
        <Text variant="label">{label}</Text>
        <Box display="flex" flexDirection="row" gap="4" width="full">
          <Box display="flex" flexDirection="column" gap="4" width="full">
            {fieldOptions.map((option, index) => (
              <Box key={index}>
                <Stack direction="horizontal" align="center" space="1">
                  {collection.collectionType === 1 && (
                    <Box
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "20%",
                        backgroundColor: option.color || "#00000000",
                        border: "1px solid #BDBDBD",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenColorPicker(true);
                        setColorPickerColor(option.color || "#000000");
                        setEditColorForOption(index);
                      }}
                    />
                  )}
                  <OptionInput
                    autoFocus={index === fieldOptions.length - 1}
                    value={option.label}
                    onChange={(e) => {
                      setIsDirty && setIsDirty(true);
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
                        setIsDirty && setIsDirty(true);
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
          </Box>
          <Box color="inherit" width="1/3">
            <Popover
              isOpen={openColorPicker}
              setIsOpen={(isOpen) => {
                console.log({ isOpen });
                setOpenColorPicker(isOpen);
              }}
              butttonComponent={<Box></Box>}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto", transition: { duration: 0.2 } }}
                exit={{ height: 0 }}
                style={{
                  overflow: "hidden",
                }}
              >
                <Box backgroundColor="background" padding="2">
                  <ColorPicker
                    hideInputs={true}
                    hideControls={true}
                    hideColorGuide={true}
                    hideInputType={true}
                    value={colorPickerColor}
                    onChange={(color: string) => {
                      setColorPickerColor(color);
                      setIsDirty && setIsDirty(true);
                      const newOptions = [...fieldOptions];
                      newOptions[editColorForOption].color = color;
                      setFieldOptions(newOptions);
                    }}
                  />
                </Box>
              </motion.div>
            </Popover>
          </Box>
        </Box>

        {!fieldOptions.length && (
          <Text variant="label">No options added yet</Text>
        )}
        {!disabled && (
          <Box padding="1" width="1/2">
            <Button
              variant="tertiary"
              size="small"
              onClick={() => {
                setIsDirty && setIsDirty(true);
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
            </Button>
          </Box>
        )}
        {collection.collectionType === 0 && (
          <Stack>
            <Text variant="label">Settings</Text>
            <Stack direction="horizontal" align="center" space="2">
              <input
                type="checkbox"
                name={"Settings"}
                checked={allowCustom}
                onChange={() => {
                  setIsDirty && setIsDirty(true);
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
                    setIsDirty && setIsDirty(true);
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
      </Stack>
    </Box>
  );
}

const OptionInput = styled.textarea<{ mode: string }>`
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
  padding: 0.1rem;

  resize: none;
  font-family: "Inter", sans-serif;

  :focus {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    transition: background 0.2s ease;
  }
`;
