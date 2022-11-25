import { Trigger } from "@/app/types";
import SingleSelectTrigger from "./SingleSelectTrigger";

type Props = {
  triggerMode: "edit" | "create";
  trigger: Trigger;
  setTrigger: (trigger: Trigger) => void;
};

export default function DataChange({
  setTrigger,
  triggerMode,
  trigger,
}: Props) {
  console.log(trigger?.data?.fieldType);
  return (
    <>
      {trigger?.data?.fieldType === "singleSelect" && (
        <SingleSelectTrigger
          trigger={trigger}
          triggerMode={triggerMode}
          setTrigger={setTrigger}
        />
      )}
    </>
  );
}
