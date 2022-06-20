import { labelsMapping } from "@/app/common/utils/constants";
import { IconBookOpen, IconEth } from "degen";
import { MemberDetails, ProjectType } from "../../../types";

const cardTypes = [
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

const priority = [
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

export const getOptions = (
  type: string,
  project: ProjectType,
  memberDetails?: MemberDetails
) => {
  switch (type) {
    case "card":
      return cardTypes;
    case "priority":
      return priority;
    case "labels":
      return Object.keys(labelsMapping).map((label) => {
        return {
          name: label,
          value: label,
        };
      });
    case "column":
      return project.columnOrder?.map((column: string) => ({
        name: project.columnDetails[column].name,
        value: column,
      }));
    case "assignee":
      return memberDetails?.members?.map((member: string) => ({
        name: memberDetails && memberDetails.memberDetails[member]?.username,
        avatar: memberDetails && memberDetails.memberDetails[member]?.avatar,
        value: member,
      }));
    default:
      return [];
  }
};
