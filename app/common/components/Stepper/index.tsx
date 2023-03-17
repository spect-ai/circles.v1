import { Box, Stack } from "degen";
import { motion } from "framer-motion";
import styled from "styled-components";

type Props = {
  steps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
};

const Stepper = ({ steps, currentStep, onStepChange }: Props) => {
  return (
    <Stack direction="horizontal">
      {Array.from({ length: steps }).map((_, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => onStepChange(index)}
        >
          <StepButton
            backgroundColor={
              index === currentStep ? "accent" : "foregroundSecondary"
            }
          />
        </motion.div>
      ))}
    </Stack>
  );
};

const StepButton = styled(Box)`
  width: 12px;
  height: 12px;
  border-radius: 10px;
  cursor: pointer;
`;

export default Stepper;
