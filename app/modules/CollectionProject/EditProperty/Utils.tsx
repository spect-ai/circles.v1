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
import { CiSliderHorizontal } from "react-icons/ci";

export const getPropertyIcon = (type: PropertyType, size?: number) => {
  switch (type) {
    case "shortText":
      return <BiText size={size || 16} />;
    case "longText":
      return <BsTextParagraph size={size || 16} />;
    case "number":
      return <AiOutlineNumber size={size || 16} />;
    case "singleSelect":
      return <BsUiRadiosGrid size={size || 16} />;
    case "multiSelect":
      return <AiOutlineCheckSquare size={size || 20} />;
    case "slider":
      return <CiSliderHorizontal size={size || 20} />;
    case "singleURL":
      return <AiOutlineLink size={size || 16} />;
    case "multiURL":
      return <MdAddLink size={size || 16} />;
    case "user":
      return <FaUser size={size || 16} />;
    case "user[]":
      return <FaUserFriends size={size || 16} />;
    case "email":
      return <AiOutlineMail size={size || 16} />;
    case "ethAddress":
      return <FaEthereum size={size || 16} />;
    case "date":
      return <BsFillCalendarDateFill size={size || 16} />;
    case "reward":
      return <MdOutlineAttachMoney size={size || 16} />;
    case "milestone":
      return <BsConeStriped size={size || 16} />;
    case "discord":
      return <FaDiscord size={size || 16} />;
    case "telegram":
      return <FaTelegram size={size || 16} />;
    case "github":
      return <FaGithub size={size || 16} />;
    case "readonly":
      return <AiOutlineRead size={size || 16} />;
    default:
      return <BiAperture size={size || 16} />;
  }
};
