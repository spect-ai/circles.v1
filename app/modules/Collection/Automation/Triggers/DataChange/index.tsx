import { Trigger, CollectionType } from "@/app/types";
import SingleSelectTrigger from "./SingleSelectTrigger";

type Props = {
  trigger: Trigger;
  setTrigger: (trigger: Trigger) => void;
  collection: CollectionType;
};

const DataChange = ({ setTrigger, trigger, collection }: Props) => {
  if (trigger?.data?.fieldType === "singleSelect") {
    return (
      <SingleSelectTrigger
        trigger={trigger}
        setTrigger={setTrigger}
        collection={collection}
      />
    );
  }
  return null;
};

export default DataChange;
