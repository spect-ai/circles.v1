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
      // { label: "Connect Wallet", value: "wallet", icon: <FaWallet /> },
      { label: "Email", value: "email", icon: <AiOutlineMail /> },
      // { label: "Twitter", value: "twitter", icon: <FaTwitter /> },
      { label: "Discord", value: "discord", icon: <FaDiscord /> },
      // { label: "Telegram", value: "telegram", icon: <FaTelegram /> },
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
