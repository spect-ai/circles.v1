import { Action, CollectionType } from "@/app/types";
import { Text } from "degen";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function CloseCard({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  return <Text></Text>;
}
