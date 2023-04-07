import { Box, Stack } from "degen";
import { motion } from "framer-motion";
import styled from "styled-components";

type Props = {
  steps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
};

const StepButton = styled(Box)`
  width: 12px;
  height: 12px;
  border-radius: 10px;
  cursor: pointer;
`;

const Stepper = ({ steps, currentStep, onStepChange }: Props) => (
  <Stack direction="horizontal">
    {Array.from({ length: steps }).map((_, index) => (
      <motion.div
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <StepButton
          backgroundColor={
            index === currentStep ? "accent" : "foregroundSecondary"
          }
          onClick={() => onStepChange(index)}
        />
      </motion.div>
    ))}
  </Stack>
);

export default Stepper;
