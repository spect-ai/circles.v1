export const fields = [
  { label: "Short Text", value: "shortText" },
  { label: "Long Text", value: "longText" },
  { label: "Number", value: "number" },
  { label: "Ethereum Address", value: "ethAddress" },
  { label: "Email", value: "email" },
  { label: "URL", value: "singleURL" },
  { label: "Pay Wall", value: "payWall" },
  { label: "Multiple URL", value: "multiURL" },
  { label: "Reward", value: "reward" },
  { label: "Milestone", value: "milestone" },
  { label: "Date", value: "date" },
  { label: "Single Select", value: "singleSelect" },
  { label: "Multiple Select", value: "multiSelect" },
  { label: "Multiple Users", value: "user[]" },
  { label: "Single User", value: "user" },
];

export const mockData = [
  {
    title: "First",
    description: "This is just the description \n of the first collection",
    status: {
      label: "To Do",
      value: "To Do",
    },
    Tags: [
      {
        label: "Bug",
        value: "Bug",
      },
      {
        label: "Frontend",
        value: "Frontend",
      },
      {
        label: "Backend",
        value: "Backend",
      },
      {
        label: "Test",
        value: "Test",
      },
      {
        label: "Feature",
        value: "Feature",
      },
    ],
  },
  {
    title: "Second",
    description: "",
    status: {
      label: "To Do",
      value: "To Do",
    },
    Tags: [
      {
        label: "Integration",
        value: "Integration",
      },
      {
        label: "Frontend",
        value: "Frontend",
      },
    ],
  },
];
