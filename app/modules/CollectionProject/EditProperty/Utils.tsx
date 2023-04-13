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
      return <BiText size={size || 20} />;
    case "longText":
      return <BsTextParagraph size={size || 20} />;
    case "number":
      return <AiOutlineNumber size={size || 20} />;
    case "singleSelect":
      return <BsUiRadiosGrid size={size || 20} />;
    case "multiSelect":
      return <AiOutlineCheckSquare size={size || 20} />;
    case "singleURL":
      return <AiOutlineLink size={size || 20} />;
    case "multiURL":
      return <MdAddLink size={size || 20} />;
    case "user":
      return <FaUser size={size || 20} />;
    case "user[]":
      return <FaUserFriends size={size || 20} />;
    case "email":
      return <AiOutlineMail size={size || 20} />;
    case "ethAddress":
      return <FaEthereum size={size || 20} />;
    case "date":
      return <BsFillCalendarDateFill size={size || 20} />;
    case "reward":
      return <MdOutlineAttachMoney size={size || 20} />;
    case "milestone":
      return <BsConeStriped size={size || 20} />;
    case "discord":
      return <FaDiscord size={size || 20} />;
    case "telegram":
      return <FaTelegram size={size || 20} />;
    case "github":
      return <FaGithub size={size || 20} />;
    case "readonly":
      return <AiOutlineRead size={size || 20} />;
    default:
      return <BiAperture size={size || 20} />;
  }
};
