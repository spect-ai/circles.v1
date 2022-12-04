import Dropdown from "@/app/common/components/Dropdown";
import { CollectionType } from "@/app/types";
import { Input } from "degen";

type Props = {
  value: any;
  onChange: (value: any) => void;
  collection: CollectionType;
  propertyId: string;
  comparatorValue: string;
};

export default function FilterField({
  value,
  onChange,
  collection,
  propertyId,
  comparatorValue,
}: Props) {
  const type = collection?.properties[propertyId]?.type;

  switch (type) {
    case "shortText":
    case "longText":
    case "ethAddress":
    case "email":
      return (
        <Input
          label=""
          placeholder={`Enter text`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          label=""
          placeholder={`Enter number`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "singleSelect":
      switch (comparatorValue) {
        case "is":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={false}
            />
          );
        case "is one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
            />
          );
        default:
          return null;
      }
    case "multiSelect":
      switch (comparatorValue) {
        case "includes all of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
            />
          );
        case "includes one of":
          return (
            <Dropdown
              options={collection.properties[propertyId]?.options || []}
              selected={value}
              onChange={(option) => {
                onChange(option);
              }}
              multiple={true}
            />
          );
        default:
          return null;
      }
    case "date":
      return (
        <Input
          label=""
          placeholder={`Enter date`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return null;
  }
}
