import { IconBookOpen, IconEth } from "degen";

export const cardTypes = [
  {
    name: "Task",
    icon: IconBookOpen,
    value: "Task",
    secondary: "Tasks can be claimed by anyone that is part of the circle",
  },
  {
    name: "Bounty",
    icon: IconEth,
    value: "Bounty",
    secondary:
      "Bounties can be claimed only when someone is picked to fulfill the bounty through an application process",
  },
];

export const priority = [
  {
    name: "Low",
    value: 1,
  },
  {
    name: "Medium",
    value: 2,
  },
  {
    name: "High",
    value: 3,
  },
  {
    name: "Urgent",
    value: 4,
  },
];

export const priorityMapping: { [key: number]: string } = {
  0: "No Priority",
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

export type Option = {
  name: string;
  value: string;
};
