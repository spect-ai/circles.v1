import { CollectionType, Trigger } from "@/app/types";
import DataChange from "./DataChange";
import { Box, Text } from "degen";

type Props = {
  triggerType: string;
  triggerMode: "edit" | "create";
  trigger: Trigger;
  collection: CollectionType;
  setTrigger: (trigger: Trigger) => void;
  triggerValidationResults: {
    isValid: boolean;
    message: string;
  };
};

export default function SingleTrigger({
  triggerType,
  triggerMode,
  trigger,
  collection,
  setTrigger,
  triggerValidationResults,
}: Props) {
  return (
    <>
      {triggerType === "dataChange" && (
        <DataChange
          trigger={trigger}
          triggerMode={triggerMode}
          setTrigger={setTrigger}
          collection={collection}
        />
      )}
      {!triggerValidationResults?.isValid && (
        <Box marginTop="4">
          <Text color="red">{triggerValidationResults?.message}</Text>
        </Box>
      )}
    </>
  );
}
