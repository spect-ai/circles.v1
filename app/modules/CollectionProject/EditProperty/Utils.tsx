import { PropertyType } from "@/app/types";
import { IconEth } from "degen";
import {
  AlignCenter,
  Aperture,
  AtSign,
  Calendar,
  DollarSign,
  Hash,
  Link,
  List,
  Tag,
  Type,
  User,
  Users,
} from "react-feather";

export const getPropertyIcon = (type: PropertyType, size?: number) => {
  switch (type) {
    case "shortText":
      return <Type size={size || 18} />;
    case "longText":
      return <AlignCenter size={size || 18} />;
    case "number":
      return <Hash size={size || 18} />;
    case "singleSelect":
      return <Aperture size={size || 18} />;
    case "multiSelect":
      return <Tag size={size || 18} />;
    case "singleURL":
    case "multiURL":
      return <Link size={size || 18} />;
    case "user":
      return <User size={size || 18} />;
    case "user[]":
      return <Users size={size || 18} />;
    case "email":
      return <AtSign size={size || 18} />;
    case "ethAddress":
      return <IconEth size="5" />;
    case "date":
      return <Calendar size={size || 18} />;
    case "reward":
      return <DollarSign size={size || 18} />;
    case "milestone":
      return <List size={size || 18} />;
    default:
      return <Aperture size={size || 18} />;
  }
};
