import { Box, Input, NumericSelect, Stack, Text } from "degen";
import React from "react";

type Props = {
  min: number;
  setMin: (min: number) => void;
  max: number;
  setMax: (max: number) => void;
  step: number;
  setStep: (step: number) => void;
  setIsDirty: (isDirty: boolean) => void;
};

const SliderOptions = ({
  min,
  max,
  step,
  setMin,
  setMax,
  setStep,
  setIsDirty,
}: Props) => {
  return (
    <Stack direction="horizontal">
      <Box width="full">
        <Stack space="1">
          <Box marginLeft="4">
            <Text variant="label">Min</Text>
          </Box>
          <NumericSelect
            count={min}
            onChange={(value) => {
              setMin(value);
              setIsDirty(true);
            }}
            max={max - 1}
          />
        </Stack>
      </Box>
      <Box width="full">
        <Stack space="1">
          <Box marginLeft="4">
            <Text variant="label">Max</Text>
          </Box>
          <NumericSelect
            count={max}
            onChange={(value) => {
              setMax(value);
              setIsDirty(true);
            }}
            max={10}
            showMaxButton
          />
        </Stack>
      </Box>

      {/* <Input
        label="Step"
        type="number"
        value={step}
        onChange={(e) => {
          setStep(parseInt(e.target.value));
          setIsDirty(true);
        }}
        step={1}
      /> */}
    </Stack>
  );
};

export default SliderOptions;
