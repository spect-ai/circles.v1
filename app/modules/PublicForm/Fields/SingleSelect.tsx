import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useRef } from "react";

type Props = {
  options: Option[];
  selected: Option;
  onSelect: (option: Option) => void;
  propertyId: string;
  allowCustom: boolean;
  disabled?: boolean;
};

const SingleSelect = ({
  options,
  selected,
  onSelect,
  propertyId,
  allowCustom,
  disabled,
}: Props) => {
  useEffect(() => {
    if (allowCustom && !options.some((o) => o.value === "__custom__")) {
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
              type="radio"
              name={propertyId}
              value={option.value}
              checked={selected?.value === option.value}
              onChange={() => {
                if (option.value === "__custom__") inputRef.current?.focus();
                onSelect(option);
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
            defaultValue={selected?.label}
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

export default SingleSelect;
