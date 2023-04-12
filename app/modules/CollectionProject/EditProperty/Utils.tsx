import { PropertyType } from "@/app/types";
import {
  AiOutlineCheckSquare,
  AiOutlineLink,
  AiOutlineMail,
  AiOutlineNumber,
  AiOutlineRead,
} from "react-icons/ai";
import { BiAperture, BiText } from "react-icons/bi";
import {
  BsConeStriped,
  BsFillCalendarDateFill,
  BsTextParagraph,
  BsUiRadiosGrid,
} from "react-icons/bs";
import {
  FaDiscord,
  FaEthereum,
  FaGithub,
  FaTelegram,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { MdAddLink, MdOutlineAttachMoney } from "react-icons/md";

export const getPropertyIcon = (type: PropertyType, size?: number) => {
  switch (type) {
    case "shortText":
      return <BiText size={size || 24} />;
    case "longText":
      return <BsTextParagraph size={size || 24} />;
    case "number":
      return <AiOutlineNumber size={size || 24} />;
    case "singleSelect":
      return <BsUiRadiosGrid size={size || 24} />;
    case "multiSelect":
      return <AiOutlineCheckSquare size={size || 24} />;
    case "singleURL":
      return <AiOutlineLink size={size || 24} />;
    case "multiURL":
      return <MdAddLink size={size || 24} />;
    case "user":
      return <FaUser size={size || 24} />;
    case "user[]":
      return <FaUserFriends size={size || 24} />;
    case "email":
      return <AiOutlineMail size={size || 24} />;
    case "ethAddress":
      return <FaEthereum size={size || 24} />;
    case "date":
      return <BsFillCalendarDateFill size={size || 24} />;
    case "reward":
      return <MdOutlineAttachMoney size={size || 24} />;
    case "milestone":
      return <BsConeStriped size={size || 24} />;
    case "discord":
      return <FaDiscord size={size || 24} />;
    case "telegram":
      return <FaTelegram size={size || 24} />;
    case "github":
      return <FaGithub size={size || 24} />;
    case "readonly":
      return <AiOutlineRead size={size || 24} />;
    default:
      return <BiAperture size={size || 24} />;
  }
};
