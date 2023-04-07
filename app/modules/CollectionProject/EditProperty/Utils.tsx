import { PropertyType } from "@/app/types";
import {
  AiOutlineCheckSquare,
  AiOutlineLink,
  AiOutlineMail,
  AiOutlineNumber,
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

const getPropertyIcon = (type: PropertyType, size?: number) => {
  switch (type) {
    case "shortText":
      return <BiText size={size || 18} />;
    case "longText":
      return <BsTextParagraph size={size || 18} />;
    case "number":
      return <AiOutlineNumber size={size || 18} />;
    case "singleSelect":
      return <BsUiRadiosGrid size={size || 18} />;
    case "multiSelect":
      return <AiOutlineCheckSquare size={size || 18} />;
    case "singleURL":
      return <AiOutlineLink size={size || 18} />;
    case "multiURL":
      return <MdAddLink size={size || 18} />;
    case "user":
      return <FaUser size={size || 18} />;
    case "user[]":
      return <FaUserFriends size={size || 18} />;
    case "email":
      return <AiOutlineMail size={size || 18} />;
    case "ethAddress":
      return <FaEthereum size={size || 18} />;
    case "date":
      return <BsFillCalendarDateFill size={size || 18} />;
    case "reward":
      return <MdOutlineAttachMoney size={size || 18} />;
    case "milestone":
      return <BsConeStriped size={size || 18} />;
    case "discord":
      return <FaDiscord size={size || 18} />;
    case "telegram":
      return <FaTelegram size={size || 18} />;
    case "github":
      return <FaGithub size={size || 18} />;
    default:
      return <BiAperture size={size || 18} />;
  }
};

export default getPropertyIcon;
