import { Trigger, CollectionType } from "@/app/types";
import SingleSelectTrigger from "./SingleSelectTrigger";

type Props = {
  triggerMode: "edit" | "create";
  trigger: Trigger;
  setTrigger: (trigger: Trigger) => void;
  collection: CollectionType;
};

export default function DataChange({
  setTrigger,
  triggerMode,
  trigger,
  collection,
}: Props) {
  return (
    <>
      {trigger?.data?.fieldType === "singleSelect" && (
        <SingleSelectTrigger
          trigger={trigger}
          triggerMode={triggerMode}
          setTrigger={setTrigger}
          collection={collection}
        />
      )}
    </>
  );
}
