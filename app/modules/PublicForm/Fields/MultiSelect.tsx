import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useRef, useState } from "react";

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
    if (allowCustom && !options.some((o) => o.value === "__custom__")) {
      options.push({ label: "Other", value: "__custom__" });
    }
  }, []);

  const [customValue, setCustomValue] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              onChange={() => {
                if (option.value === "__custom__") {
                  onSelect({ label: "", value: "__custom__" });
                  if (!selected?.some((o) => o.value === "__custom__")) {
                    inputRef.current?.focus();
                  }
                } else {
                  onSelect(option);
                }
              }}
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
            onChange={(e) => {
              setCustomValue(e.target.value);
            }}
            onBlur={() => {
              onSelect({ label: customValue, value: "__custom__" });
            }}
            onFocus={() => {
              if (selected?.some((o) => o.value === "__custom__")) {
                onSelect({ label: customValue, value: "__custom__" });
              }
            }}
            disabled={disabled}
          />
        )}
      </Stack>
    </Box>
  );
};

MultiSelect.defaultProps = {
  disabled: false,
};

export default MultiSelect;
