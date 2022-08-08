import { labels as labelArray } from "@/app/common/utils/constants";
import { OptionType } from "../../../common/components/MultiSelectDropDown/MultiSelectDropDown";

const labels = [] as any;

labelArray.map((la) => labels.push({ name: la, id: la }));

export { labels };

export const cardType = [
  {
    name: "Task",
    id: "Task",
  },
  {
    name: "Bounty",
    id: "Bounty",
  },
];

export const priorityType = [
  {
    name: "Low",
    id: "1",
  },
  {
    name: "Medium",
    id: "2",
  },
  {
    name: "High",
    id: "3",
  },
  {
    name: "Urgent",
    id: "4",
  },
];

export const Status = [
  {
    name: "Paid",
    id: "Paid",
  },
  {
    name: "Active",
    id: "Active",
  },
  {
    name: "Archived",
    id: "Archived",
  },
];
