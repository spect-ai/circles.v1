import { Condition } from "@/app/types";

export function validateCondition(condition: Condition): boolean {
  if (!condition.data?.value) return false;
  if (
    Array.isArray(condition.data?.value) &&
    condition.data?.value?.length === 0
  ) {
    return false;
  }
  if (
    typeof condition.data?.value === "object" &&
    Object.keys(condition.data?.value)?.length === 0
  ) {
    return false;
  }
  if (!condition.data?.comparator) return false;
  if (!condition.data?.field) return false;

  return true;
}

export function validateConditions(conditions: Condition[]): boolean {
  if (conditions.length === 0) return true;
  return conditions.every((condition) => validateCondition(condition));
}
