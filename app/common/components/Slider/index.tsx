import { Box, Stack, Text, useTheme } from "degen";
import React, { ReactElement } from "react";
import RCSlider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

type Props = {
  label?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number | number[]) => void;
  disabled?: boolean;
};

type MarksProps = {
  min: number;
  max: number;
  step: number;
};

const StyledContainer = styled.div`
  padding: 0.5rem 0.75rem;
`;

const Marks = ({ min, max, step }: MarksProps) => {
  const marks: Record<string, ReactElement> = {};
  for (let i = min; i <= max; i += step) {
    marks[i.toString()] = (
      <Box marginTop="2">
        <Text size="small" color="textTertiary">
          {i}
        </Text>
      </Box>
    );
  }
  return marks;
};

const Slider = ({ label, min, max, step, value, onChange }: Props) => {
  const { mode } = useTheme();
  return (
    <Box paddingBottom="6">
      <Stack>
        {label && (
          <Box>
            <Text variant="label">{label}</Text>
          </Box>
        )}
        <StyledContainer>
          <RCSlider
            defaultValue={value}
            onChange={onChange}
            marks={Marks({ min, max, step })}
            min={min}
            max={max}
            step={step}
            trackStyle={{
              backgroundColor: "rgb(191,90,242,0.8)",
              height: 10,
            }}
            handleStyle={{
              borderColor: "rgb(191,90,242)",
              height: 22,
              width: 22,
              marginLeft: 0,
              marginTop: -5,
              backgroundColor: "rgb(20,20,20)",
            }}
            railStyle={{
              backgroundColor: "rgb(191,90,242,0.1)",
              height: 10,
            }}
            dotStyle={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          />
        </StyledContainer>
      </Stack>
    </Box>
  );
};

export default Slider;
