import { Box, Input, NumericSelect, Stack, Text } from "degen";
import React from "react";

type Props = {
  min: number;
  setMin: (min: number) => void;
  max: number;
  setMax: (max: number) => void;
  step: number;
  setStep: (step: number) => void;
  minLabel: string;
  setMinLabel: (minLabel: string) => void;
  maxLabel: string;
  setMaxLabel: (maxLabel: string) => void;
  setIsDirty: (isDirty: boolean) => void;
};

const SliderOptions = ({
  min,
  max,
  step,
  setMin,
  setMax,
  setStep,
  minLabel,
  setMinLabel,
  maxLabel,
  setMaxLabel,
  setIsDirty,
}: Props) => {
  return (
    <Stack direction="horizontal">
      <Box width="full">
        <Stack space="1">
          <Input
            label="Min"
            type="number"
            value={min}
            onChange={(e) => {
              setMin(parseInt(e.target.value));
              setIsDirty(true);
            }}
            step={1}
            min={1}
          />
          <Input
            placeholder="Optional"
            label="Min Label"
            type="text"
            value={minLabel}
            onChange={(e) => {
              setMinLabel(e.target.value);
              setIsDirty(true);
            }}
          />
        </Stack>
      </Box>
      <Box width="full">
        <Stack space="1">
          <Input
            label="Max"
            type="number"
            value={max}
            onChange={(e) => {
              setMax(parseInt(e.target.value));
              setIsDirty(true);
            }}
            max={10}
            step={1}
          />
          <Input
            placeholder="Optional"
            label="Max Label"
            type="text"
            value={maxLabel}
            onChange={(e) => {
              setMaxLabel(e.target.value);
              setIsDirty(true);
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default SliderOptions;
