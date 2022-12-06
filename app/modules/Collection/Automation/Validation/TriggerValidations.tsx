import { Trigger } from "@/app/types";

export function validateTrigger(trigger: Trigger): boolean {
  if (trigger.type === "dataChange") {
    if (!trigger.subType) {
      return false;
    }

    if (["singleSelect", "multiSelect"].includes(trigger.subType)) {
      return validateSelectTrigger(trigger);
    }
  }
  return true;
}

export function validateSelectTrigger(trigger: Trigger): boolean {
  if (!trigger?.data?.to?.length && !trigger?.data?.from?.length) {
    return false;
  }

  return true;
}
