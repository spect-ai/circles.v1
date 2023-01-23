import Popover from "@/app/common/components/Popover";
import { Box, Stack, useTheme, Text } from "degen";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import styled from "styled-components";
import { matchSorter } from "match-sorter";
import { PaymentDetails } from "@/app/types";

type Props = {
  options: any;
  value: PaymentDetails;
  setValue: (value: PaymentDetails) => void;
  multiple?: boolean;
};

export default function PaymentDropdown({
  options,
  value,
  setValue,
  multiple = false,
}: Props) {
  const { mode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any>([]);
  const fieldInput = useRef<any>();
  const [tempValue, setTempValue] = useState<any>();

  return (
    <Popover
      width="full"
      isOpen={isEditing}
      setIsOpen={setIsEditing}
      dependentRef={fieldInput}
      butttonComponent={
        <Box>
          {isEditing ? (
            <FieldInputContainer ref={fieldInput} padding="0">
              <Stack direction="horizontal" wrap space="2">
                <FieldInput
                  mode={mode}
                  autoFocus
                  value={tempValue}
                  onChange={(e) => {
                    setTempValue(e.target.value);
                    setFilteredOptions(
                      matchSorter(options, e.target.value, {
                        keys: ["value", "label"],
                      })
                    );
                  }}
                />
              </Stack>
            </FieldInputContainer>
          ) : (
            <FieldButton
              onClick={() => {
                setIsEditing(true);
              }}
              mode={mode}
            >
              {value.status ? <Text>{value.status}</Text> : "Empty"}
            </FieldButton>
          )}
        </Box>
      }
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{
          height: "auto",
          transition: { duration: 0.2 },
        }}
        exit={{ height: 0 }}
        style={{
          overflow: "hidden",
        }}
      >
        <Box backgroundColor="background">
          <MenuContainer>
            <Stack space="0">
              {filteredOptions?.map((option: any) => (
                <MenuItem
                  padding="2"
                  key={option.value}
                  onClick={() => {
                    setValue({
                      ...value,
                      status: option.label,
                    });
                    setIsEditing(false);
                  }}
                >
                  <Text>{option.label}</Text>
                </MenuItem>
              ))}
            </Stack>
          </MenuContainer>
        </Box>
      </motion.div>
    </Popover>
  );
}

const FieldButton = styled.div<{ mode: string }>`
  width: 30rem;
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.25)" : "rgb(0, 0, 0, 0.25)"};
  padding: 0.5rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }

  transition: background 0.2s ease;
`;

const FieldInputContainer = styled(Box)`
  width: 25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(191, 90, 242, 0.1);
`;

const FieldInput = styled.input<{ mode: string }>`
  outline: none;
  border-color: transparent;
  padding: 0.45rem 0.3rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  font-size: 0.95rem;
  background: transparent;
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.65)" : "rgb(0, 0, 0, 0.65)"};
  font-family: "Inter", sans-serif;
  width: 100%;
`;

export const MenuContainer = styled(Box)<{ cWidth?: string }>`
  width: ${(props) => props.cWidth || "25rem"};
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: rgb(28, 25, 31);
  transition: all 0.15s ease-out;

  max-height: 20rem;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 15rem;
  }
`;

export const MenuItem = styled(Box)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }
  transition: background 0.2s ease;
`;
