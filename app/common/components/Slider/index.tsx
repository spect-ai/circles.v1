import { Box, Stack, Text, useTheme } from "degen";
import React, { ReactElement } from "react";
import RCSlider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";
import { SelectField } from "@avp1598/vibes";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  min: number;
  max: number;
  value: Option;
  onChange: (value: Option) => void;
  minLabel: string | undefined;
  maxLabel: string | undefined;
  disabled?: boolean;
};

const Slider = ({
  label,
  min,
  max,
  value,
  onChange,
  minLabel,
  maxLabel,
  disabled,
}: Props) => {
  return (
    // <Box paddingY="4" paddingX="3">
    //   <Stack>
    //     {label && (
    //       <Box>
    //         <Text variant="label">{label}</Text>
    //       </Box>
    //     )}
    //     <RCSlider
    //       defaultValue={value}
    //       onChange={onChange}
    //       marks={Marks({ min, max, step })}
    //       min={min}
    //       max={max}
    //       step={step}
    //       trackStyle={{
    //         backgroundColor: "rgb(191,90,242,0.8)",
    //         height: 10,
    //       }}
    //       handleStyle={{
    //         borderColor: "rgb(191,90,242)",
    //         height: 22,
    //         width: 22,
    //         marginLeft: 0,
    //         marginTop: -5,
    //         backgroundColor: "rgb(20,20,20)",
    //         display: value ? "block" : "none",
    //       }}
    //       railStyle={{
    //         backgroundColor: "rgb(191,90,242,0.1)",
    //         height: 10,
    //       }}
    //       dotStyle={{
    //         backgroundColor: "transparent",
    //         borderColor: "transparent",
    //       }}
    //       disabled={disabled}
    //     />
    //     <Box marginTop="6">
    //       <Stack direction="horizontal" justify="space-between">
    //         <Text variant="label">{minLabel}</Text>
    //         <Text variant="label">{maxLabel}</Text>
    //       </Stack>
    //     </Box>
    //   </Stack>
    // </Box>
    <SelectField
      name={label || "Rating"}
      value={value}
      options={Array.from({ length: max - min + 1 }, (_, i) => ({
        label: `${i + min}`,
        value: `${i + min}`,
      }))}
      onChange={onChange}
      isMulti={false}
      startLabel={minLabel}
      endLabel={maxLabel}
      type="rating"
    />
  );
};

export default Slider;
