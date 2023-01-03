import { Trigger } from "@/app/types";
import DataChange from "./DataChange";

type Props = {
  triggerType: string;
  triggerMode: "edit" | "create";
  trigger: Trigger;
  setTrigger: (trigger: Trigger) => void;
};

export default function SingleTrigger({
  triggerType,
  triggerMode,
  trigger,
  setTrigger,
}: Props) {
  return (
    <>
      {triggerType === "dataChange" && (
        <DataChange
          trigger={trigger}
          triggerMode={triggerMode}
          setTrigger={setTrigger}
        />
      )}
    </>
  );
}
