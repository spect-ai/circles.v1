import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import React, { useEffect, useRef } from "react";

type Props = {
  options: Option[];
  selected: Option[];
  onSelect: (option: Option) => void;
  propertyName: string;
  allowCustom: boolean;
  disabled?: boolean;
};

const MultiSelect = ({
  options,
  selected,
  onSelect,
  propertyName,
  allowCustom,
  disabled,
}: Props) => {
  useEffect(() => {
    if (allowCustom) {
      options.push({ label: "Other", value: "__custom__" });
    }
  }, []);

  const inputRef: any = useRef();
  return (
    <Box>
      <Stack>
        {options.map((option) => (
          <Stack key={option.value} direction="horizontal" align="center">
            <input
              type="checkbox"
              name={propertyName}
              value={option.value}
              checked={selected?.some((o) => o.value === option.value)}
              onChange={() => onSelect(option)}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            <Text size="small" weight="light">
              {option.label}
            </Text>
          </Stack>
        ))}
        {allowCustom && (
          <Input
            ref={inputRef}
            label=""
            placeholder="Custom answer"
            defaultValue={
              selected?.find((o) => o.value === "__custom__")?.label
            }
            onBlur={(e) => {
              onSelect({ label: e.target.value, value: "__custom__" });
            }}
            onFocus={(e) => {
              onSelect({ label: "", value: "__custom__" });
            }}
            disabled={disabled}
          />
        )}
      </Stack>
    </Box>
  );
};

export default MultiSelect;
