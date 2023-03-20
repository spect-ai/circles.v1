import React from "react";
import { BiText } from "react-icons/bi";
import {
  BsTextParagraph,
  BsFillCalendarDateFill,
  BsUiRadiosGrid,
  BsConeStriped,
} from "react-icons/bs";
import {
  AiOutlineNumber,
  AiOutlineMail,
  AiOutlineLink,
  AiOutlineCheckSquare,
} from "react-icons/ai";
import { MdAddLink, MdOutlineAttachMoney } from "react-icons/md";
import { GoMilestone } from "react-icons/go";
import {
  FaEthereum,
  FaUserFriends,
  FaUser,
  FaTwitter,
  FaDiscord,
  FaTelegram,
  FaGithub,
  FaWallet,
} from "react-icons/fa";
import { Action } from "@/app/types";

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
  { label: "Connect Wallet", value: "connectWallet", icon: <FaWallet /> },
  { label: "Email", value: "email", icon: <AiOutlineMail /> },
  { label: "Twitter", value: "twitter", icon: <FaTwitter /> },
  { label: "Discord", value: "discord", icon: <FaDiscord /> },
  { label: "Telegram", value: "telegram", icon: <FaTelegram /> },
  { label: "Github", value: "github", icon: <FaGithub /> },
];

export const fieldOptionsDropdown = [
  {
    label: "Text",
    options: [
      { label: "Short Text", value: "shortText", icon: <BiText /> },
      { label: "Long Text", value: "longText", icon: <BsTextParagraph /> },
    ],
  },
  {
    label: "Contact Info",
    options: [
      { label: "Email", value: "email", icon: <AiOutlineMail /> },
      // { label: "Twitter", value: "twitter", icon: <FaTwitter /> },
      { label: "Discord", value: "discord", icon: <FaDiscord /> },
      { label: "Telegram", value: "telegram", icon: <FaTelegram /> },
      { label: "Github", value: "github", icon: <FaGithub /> },
    ],
  },
  {
    label: "Choices",
    options: [
      {
        label: "Single Select",
        value: "singleSelect",
        icon: <BsUiRadiosGrid />,
      },
      {
        label: "Multiple Select",
        value: "multiSelect",
        icon: <AiOutlineCheckSquare />,
      },
    ],
  },
  {
    label: "Links",
    options: [
      { label: "URL", value: "singleURL", icon: <AiOutlineLink /> },
      { label: "Multiple URL", value: "multiURL", icon: <MdAddLink /> },
    ],
  },
  {
    label: "Web3 Input",
    options: [
      { label: "Ethereum Address", value: "ethAddress", icon: <FaEthereum /> },
      { label: "Reward", value: "reward", icon: <MdOutlineAttachMoney /> },
      { label: "Milestone", value: "milestone", icon: <BsConeStriped /> },
    ],
  },
  {
    label: "Users",
    options: [
      { label: "Multiple Users", value: "user[]", icon: <FaUserFriends /> },
      { label: "Single User", value: "user", icon: <FaUser /> },
    ],
  },
  {
    label: "Other Input",
    options: [
      { label: "Number", value: "number", icon: <AiOutlineNumber /> },
      { label: "Date", value: "date", icon: <BsFillCalendarDateFill /> },
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
