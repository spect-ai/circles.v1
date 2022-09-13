export function getConditionOptions(type: string) {
  switch (type) {
    case "user[]":
      return [
        {
          label: "is",
          value: "is",
        },
        {
          label: "is one of",
          value: "isOneOf",
        },
      ];
    case "shortText":
      return [
        {
          label: "is",
          value: "is",
        },
        {
          label: "includes",
          value: "includes",
        },
      ];
    case "longText":
      return [
        {
          label: "is",
          value: "is",
        },
        {
          label: "includes",
          value: "includes",
        },
      ];
    case "number":
      return [
        {
          label: "is",
          value: "is",
        },
      ];
    case "reward":
      return [
        {
          label: "network is",
          value: "isNetwork",
        },
        {
          label: "token is",
          value: "isToken",
        },
        {
          label: "value is",
          value: "isValue",
        },
      ];

    case "date":
      return [
        {
          label: "is",
          value: "is",
        },
        {
          label: "is After",
          value: "isAfter",
        },
        {
          label: "is Before",
          value: "isBefore",
        },
      ];

    case "singleSelect":
      return [
        {
          label: "is",
          value: "isValue",
        },
      ];

    case "multiSelect":
      return [
        {
          label: "value is one of",
          value: "includes",
        },
      ];

    case "ethAddress":
      return [
        {
          label: "is",
          value: "is",
        },
      ];
  }
}

export function getValueComponent(type: string, conditionValue: string) {}
