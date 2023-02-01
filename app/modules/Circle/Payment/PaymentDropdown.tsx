import Popover from "@/app/common/components/Popover";
import { Box, Stack, useTheme, Text, IconClose, Tag } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { matchSorter } from "match-sorter";
import { Option, PaymentDetails } from "@/app/types";
import { toast } from "react-toastify";
import { updateCircle } from "@/app/services/UpdateCircle";
import { updatePayment } from "@/app/services/Paymentv2";
import { useCircle } from "../CircleContext";

type Props = {
  options: Option[];
  setOptions: (options: Option[]) => void;
  value: any;
  setValue: (value: any, opts?: Option[]) => void;
  paymentId: string;
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  goToLink?: string;
};

export default function PaymentDropdown({
  options,
  setOptions,
  value,
  setValue,
  paymentId,
  multiple = false,
  disabled,
  clearable,
  goToLink,
}: Props) {
  const { mode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any>(options);
  const fieldInput = useRef<any>();
  const [tempValue, setTempValue] = useState<any>("");
  const { circle } = useCircle();
  const [mouseOver, setMouseOver] = useState(false);
  const [dynamicFieldWidth, setDynamicFieldWidth] = useState(0);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <Popover
      width="full"
      isOpen={isEditing}
      setIsOpen={setIsEditing}
      dependentRef={fieldInput}
      butttonComponent={
        <Box
          onMouseOver={() => {
            setMouseOver(true);
          }}
          onMouseLeave={() => {
            setMouseOver(false);
          }}
        >
          {isEditing ? (
            <FieldInputContainer
              ref={fieldInput}
              padding={multiple ? "2" : "0"}
            >
              <Stack direction="horizontal" wrap space="2">
                {multiple &&
                  value?.map((val: any) => (
                    <Tag tone="accent" hover key={val.value}>
                      <Stack direction="horizontal" space="1" align="center">
                        {val.label}
                        <Box
                          cursor="pointer"
                          onClick={() => {
                            const change = value.filter(
                              (v: any) => v.value !== val.value
                            );
                            setValue(change);
                          }}
                        >
                          <IconClose size="4" color="red" />
                        </Box>
                      </Stack>
                    </Tag>
                  ))}
                <FieldInput
                  mode={mode}
                  autoFocus
                  value={tempValue}
                  onChange={(e) => {
                    setTempValue(e.target.value);
                    setFilteredOptions(
                      options?.length
                        ? matchSorter(options, e.target.value, {
                            keys: ["value", "label"],
                          })
                        : []
                    );
                  }}
                />
              </Stack>
            </FieldInputContainer>
          ) : (
            <Box>
              <FieldButton
                onClick={() => {
                  if (!disabled) setIsEditing(true);
                }}
                mode={mode}
              >
                {multiple ? (
                  value?.length ? (
                    value?.map((val: any) => (
                      <Box cursor="pointer" key={val.value}>
                        <Tag key={val.value} tone="accent" hover>
                          {val.label}
                        </Tag>
                      </Box>
                    ))
                  ) : (
                    "Empty"
                  )
                ) : value ? (
                  <Box display="flex" flexDirection="row" gap="4">
                    <Text>{value.label}</Text>
                  </Box>
                ) : (
                  "Empty"
                )}
              </FieldButton>
              {mouseOver &&
                (value?.length || value?.value) &&
                (clearable || goToLink) && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: "auto",
                        transition: { duration: 0.2 },
                      }}
                      exit={{ transition: { duration: 0.2 } }}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        gap="4"
                        padding="2"
                        justifyContent="flex-end"
                        alignItems="center"
                        style={{
                          width: "25rem",
                        }}
                      >
                        {goToLink && (
                          <a href={goToLink} target="_blank">
                            <Box cursor="pointer">
                              <Text variant="label" color="backgroundTertiary">
                                Check it out
                              </Text>
                            </Box>
                          </a>
                        )}
                        {clearable && (
                          <Box
                            onClick={() => {
                              if (multiple) setValue([]);
                              else setValue(null);
                            }}
                            cursor="pointer"
                          >
                            <Text variant="label" color="backgroundTertiary">
                              Clear
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                )}
            </Box>
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
                    if (multiple) {
                      if (!value) {
                        setValue([option]);
                      } else {
                        if (
                          !value.find((val: any) => val.value === option.value)
                        )
                          setValue([...value, option]);
                      }
                    } else {
                      setValue(option);
                      setIsEditing(false);
                    }
                  }}
                >
                  <Text>{option.label}</Text>
                </MenuItem>
              ))}
              {tempValue && multiple && (
                <MenuItem
                  padding="2"
                  onClick={async () => {
                    let res;
                    res = await updateCircle(
                      {
                        paymentLabelOptions: [
                          ...(options || []),
                          { label: tempValue, value: tempValue },
                        ],
                      },
                      circle.id
                    );
                    if (!res.id) {
                      toast.error("Failed to update label options");
                      return;
                    }
                    const newOptions = [
                      ...(options || []),
                      { label: tempValue, value: tempValue },
                    ];
                    setOptions(newOptions);
                    setFilteredOptions(newOptions);
                    if (multiple) {
                      if (!value) {
                        setValue(
                          [{ label: tempValue, value: tempValue }],
                          newOptions
                        );
                      } else {
                        if (!value.find((val: any) => val.value === tempValue))
                          setValue(
                            [...value, { label: tempValue, value: tempValue }],
                            newOptions
                          );
                      }
                    } else {
                      setValue({ label: tempValue, value: tempValue });
                      setIsEditing(false);
                    }
                    setTempValue("");
                  }}
                >
                  <Text variant="label">{`Add "${tempValue}" Option`}</Text>
                </MenuItem>
              )}
            </Stack>
          </MenuContainer>
        </Box>
      </motion.div>
    </Popover>
  );
}

const FieldButton = styled.div<{ mode: string }>`
  width: 25rem;
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
