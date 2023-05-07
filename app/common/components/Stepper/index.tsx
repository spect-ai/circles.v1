import styled from "@emotion/styled";
import { Box, Stack } from "degen";

type Props = {
  steps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
};

const Stepper = ({ steps, currentStep, onStepChange }: Props) => {
  return (
    <Stack direction="horizontal">
      {Array.from({ length: steps }).map((_, index) => (
        <div key={index}>
          <StepButton
            backgroundColor={
              index === currentStep ? "accent" : "foregroundSecondary"
            }
            onClick={() => onStepChange(index)}
          />
        </div>
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
