import { IconBookOpen, IconEth } from "degen";

export const cardTypes = [
  {
    name: "Task",
    icon: IconBookOpen,
    value: "Task",
    secondary: "Create task to be completed internally",
  },
  {
    name: "Bounty",
    icon: IconEth,
    value: "Bounty",
    secondary: "Create bounty which can be taken up by any user",
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
