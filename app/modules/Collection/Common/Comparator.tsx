import { Option } from "@/app/types";

export function getComparators(propertyType: string): Option[] {
  switch (propertyType) {
    case "shortText":
    case "longText":
      return [
        { label: "is", value: "is" },
        { label: "is not", value: "is not" },
        { label: "contains", value: "contains" },
        { label: "does not contain", value: "does not contain" },
        { label: "starts with", value: "starts with" },
        { label: "ends with", value: "ends with" },
      ];

    case "ethAddress":
    case "email":
    case "singleURL":
      return [
        { label: "is", value: "is" },
        { label: "is not", value: "is not" },
      ];

    case "number":
      return [
        { label: "is", value: "is" },
        { label: "is not", value: "is not" },
        { label: "is greater than", value: "is greater than" },
        { label: "is less than", value: "is less than" },
      ];
    case "singleSelect":
    case "user":
      return [
        { label: "is", value: "is" },
        { label: "is not", value: "is not" },
        { label: "is one of", value: "is one of" },
      ];
    case "multiSelect":
    case "user[]":
      return [
        { label: "includes one of", value: "includes one of" },
        { label: "includes all of", value: "includes all of" },
        { label: "does not include", value: "does not include" },
      ];
    case "date":
      return [
        { label: "is", value: "is" },
        { label: "is not", value: "is not" },
        { label: "is after", value: "is after" },
        { label: "is before", value: "is before" },
      ];
    case "reward":
      return [
        { label: "value is", value: "value is" },
        { label: "value is greater than", value: "value is greater than" },
        { label: "value is less than", value: "value is less than" },
        { label: "token is", value: "token is" },
        { label: "token is one of", value: "token is one of" },
      ];
    case "milestone":
      return [
        { label: "count is greater than", value: "count is greater than" },
        { label: "count is less than", value: "count is less than" },
      ];
    case "payWall":
      return [
        { label: "is paid", value: "is paid" },
        { label: "is unpaid", value: "is unpaid" },
      ];
    case "cardStatus":
      return [
        { label: "is active", value: "is active" },
        { label: "is closed", value: "is closed" },
      ];

    default:
      return [];
  }
}
