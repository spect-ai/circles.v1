import { labelsMapping } from "@/app/common/utils/constants";
import { IconBookOpen, IconEth } from "degen";
import { ProjectType } from "../../../types";

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

export const typeMapping = {
  card: "Set Card type",
  column: "Set Column",
  assignee: "Choose Assignee(s)",
  deadline: "Set Deadline",
  reward: "Set Reward",
  labels: "Set Labels",
};

export const getOptions = (type: string, space: ProjectType) => {
  console.log({ space });
  switch (type) {
    case "card":
      return cardTypes;
    case "labels":
      return Object.keys(labelsMapping).map((label) => {
        return {
          name: label,
          value: label,
        };
      });
    case "column":
      return space.columnOrder.map((column: any) => ({
        name: space.columns[column].title,
        value: column,
      }));
    case "assignee":
      return space.members.map((member: any) => space.memberDetails[member]);
    default:
      return [];
  }
};
