import { CollectionType, Trigger } from "@/app/types";
import { Box, Text } from "degen";
import DataChange from "./DataChange";

type Props = {
  triggerType: string;
  trigger: Trigger;
  collection: CollectionType;
  setTrigger: (trigger: Trigger) => void;
  triggerValidationResults: {
    isValid: boolean;
    message: string;
  };
};

const SingleTrigger = ({
  triggerType,
  trigger,
  collection,
  setTrigger,
  triggerValidationResults,
}: Props) => (
  <Box>
    {triggerType === "dataChange" && (
      <DataChange
        trigger={trigger}
        setTrigger={setTrigger}
        collection={collection}
      />
    )}
    {!triggerValidationResults?.isValid && (
      <Box marginTop="4">
        <Text color="red">{triggerValidationResults?.message}</Text>
      </Box>
    )}
  </Box>
);

export default SingleTrigger;
