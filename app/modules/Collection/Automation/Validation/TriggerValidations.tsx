import { Trigger } from "@/app/types";

export function validateSelectTrigger(trigger: Trigger): {
  isValid: boolean;
  message: string;
} {
  if (!trigger?.data?.to?.length && !trigger?.data?.from?.length) {
    return {
      isValid: false,
      message: "Either to or from value is required",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validateTrigger(trigger: Trigger): {
  isValid: boolean;
  message: string;
} {
  if (!trigger.type) {
    return {
      isValid: false,
      message: "No trigger was added",
    };
  }
  if (trigger.type === "dataChange") {
    if (!trigger.subType) {
      return {
        isValid: false,
        message: "Only single select and multi select are supported",
      };
    }

    if (["singleSelect", "multiSelect"].includes(trigger.subType)) {
      return validateSelectTrigger(trigger);
    }
  }

  return {
    isValid: true,
    message: "",
  };
}
