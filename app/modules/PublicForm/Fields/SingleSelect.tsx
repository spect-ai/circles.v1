import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useRef, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  useEffect(() => {
    if (allowCustom && !options.some((o) => o.value === "__custom__")) {
      setLoading(true);
      options.push({ label: "Other", value: "__custom__" });
      setTimeout(() => {
        setLoading(false);
      }, 100);
    } else {
      setLoading(false);
    }
  }, []);

  const inputRef: any = useRef();

  return (
    <Box>
      <Stack>
        {!loading &&
          options.map((option) => (
            <Stack key={option.value} direction="horizontal" align="center">
              <input
                type="radio"
                name={propertyId}
                value={option.value}
                checked={selected?.value === option.value}
                onChange={() => {
                  if (option.value === "__custom__") {
                    setShowInput(true);
                    onSelect({ label: "", value: option.value });
                  } else {
                    onSelect(option);
                    setShowInput(false);
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
        {showInput && (
          <Input
            ref={inputRef}
            label=""
            placeholder="Custom answer"
            defaultValue={selected?.label}
            onBlur={(e) => {
              onSelect({ label: e.target.value, value: "__custom__" });
            }}
            disabled={disabled}
          />
        )}
      </Stack>
    </Box>
  );
};

export default SingleSelect;
