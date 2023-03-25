import { getPropertyIcon } from "../CollectionProject/EditProperty/Utils";

export const fields = [
  { label: "Short Text", value: "shortText" },
  { label: "Long Text", value: "longText" },
  { label: "Number", value: "number" },
  { label: "Ethereum Address", value: "ethAddress" },
  { label: "Email", value: "email" },
  { label: "URL", value: "singleURL" },
  { label: "Multiple URL", value: "multiURL" },
  { label: "Reward", value: "reward" },
  { label: "Milestone", value: "milestone" },
  { label: "Date", value: "date" },
  { label: "Single Select", value: "singleSelect" },
  { label: "Multiple Select", value: "multiSelect" },
  { label: "Multiple Users", value: "user[]" },
  { label: "Single User", value: "user" },
  { label: "Connect Wallet", value: "connectWallet" },
  { label: "Email", value: "email" },
  { label: "Twitter", value: "twitter" },
  { label: "Discord", value: "discord" },
  { label: "Telegram", value: "telegram" },
  { label: "Github", value: "github" },
];

export const fieldOptionsDropdown = [
  {
    label: "Text",
    options: [
      {
        label: "Short Text",
        value: "shortText",
        icon: getPropertyIcon("shortText"),
      },
      {
        label: "Long Text",
        value: "longText",
        icon: getPropertyIcon("longText"),
      },
    ],
  },
  {
    label: "Contact Info",
    options: [
      { label: "Email", value: "email", icon: getPropertyIcon("email") },
      // { label: "Twitter", value: "twitter", icon: <FaTwitter /> },
      { label: "Discord", value: "discord", icon: getPropertyIcon("discord") },
      {
        label: "Telegram",
        value: "telegram",
        icon: getPropertyIcon("telegram"),
      },
      { label: "Github", value: "github", icon: getPropertyIcon("github") },
    ],
  },
  {
    label: "Choices",
    options: [
      {
        label: "Single Select",
        value: "singleSelect",
        icon: getPropertyIcon("singleSelect"),
      },
      {
        label: "Multiple Select",
        value: "multiSelect",
        icon: getPropertyIcon("multiSelect"),
      },
    ],
  },
  {
    label: "Links",
    options: [
      { label: "URL", value: "singleURL", icon: getPropertyIcon("singleURL") },
      {
        label: "Multiple URL",
        value: "multiURL",
        icon: getPropertyIcon("multiURL"),
      },
    ],
  },
  {
    label: "Web3 Input",
    options: [
      {
        label: "Ethereum Address",
        value: "ethAddress",
        icon: getPropertyIcon("ethAddress"),
      },
      { label: "Reward", value: "reward", icon: getPropertyIcon("reward") },
      {
        label: "Milestone",
        value: "milestone",
        icon: getPropertyIcon("milestone"),
      },
    ],
  },
  {
    label: "Users",
    options: [
      {
        label: "Multiple Users",
        value: "user[]",
        icon: getPropertyIcon("user[]"),
      },
      { label: "Single User", value: "user", icon: getPropertyIcon("user") },
    ],
  },
  {
    label: "Other Input",
    options: [
      { label: "Number", value: "number", icon: getPropertyIcon("number") },
      { label: "Date", value: "date", icon: getPropertyIcon("date") },
    ],
  },
];

export const automationActionOptions = [
  {
    label: "Project",
    options: [
      {
        label: "Create Card",
        value: "createCard",
        id: "createCard",
        name: "Create Card",
        service: "collection",
        type: "createCard",
        data: {},
      },
      {
        label: "Close Card",
        value: "closeCard",
        id: "closeCard",
        name: "Close Card",
        service: "collection",
        type: "closeCard",
        group: "Project",
        data: {},
      },
    ],
  },
  {
    label: "Discord",
    options: [
      {
        label: "Give Discord Role",
        value: "giveDiscordRole",
        id: "giveDiscordRole",
        name: "Give Discord Role",
        service: "circle",
        type: "giveDiscordRole",
        group: "Discord",
        data: {},
      },
      {
        label: "Create Discord Channel",
        value: "createDiscordChannel",
        id: "createDiscordChannel",
        name: "Create Discord Channel",
        service: "discord",
        type: "createDiscordChannel",
        group: "Discord",
        data: {},
      },
      {
        label: "Post in Discord Channel",
        value: "postOnDiscord",
        id: "postOnDiscord",
        name: "Post in Discord Channel",
        service: "discord",
        type: "postOnDiscord",
        group: "Discord",
        data: {},
      },
      {
        label: "Create Discord Thread",
        value: "createDiscordThread",
        id: "createDiscordThread",
        name: "Create Discord Thread",
        service: "discord",
        type: "createDiscordThread",
        group: "Discord",
        data: {},
      },
      {
        label: "Post in Linked Discord Thread",
        value: "postOnDiscordThread",
        id: "postOnDiscordThread",
        name: "Post in Linked Discord Thread",
        service: "discord",
        type: "postOnDiscordThread",
        group: "Discord",
        data: {},
      },
    ],
  },
  {
    label: "Space & Workstream",
    options: [
      {
        label: "Give Circle Role",
        value: "giveRole",
        id: "giveRole",
        name: "Give Circle Role",
        service: "circle",
        type: "giveRole",
        group: "Space & Workstream",
        data: {},
      },
      {
        label: "Initiate Pending Payment",
        value: "initiatePendingPayment",
        id: "initiatePendingPayment",
        name: "Initiate Pending Payment",
        service: "collection",
        type: "initiatePendingPayment",
        group: "Space & Workstream",
        data: {},
      },
    ],
  },
  {
    label: "Others",
    options: [
      {
        label: "Send Email",
        value: "sendEmail",
        id: "sendEmail",
        name: "Send Email",
        service: "email",
        type: "sendEmail",
        group: "Others",
        data: {},
      },
    ],
  },
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
