import DateProperty from "./DateProperty";
import MultiUserProperty from "./MultiUserProperty";
import RewardProperty from "./RewardProperty";
import SingleSelectProperty from "./SingleSelectProperty";

export const typeToComponentMap = {
  "user[]": MultiUserProperty,
  date: DateProperty,
  singleSelect: SingleSelectProperty,
  reward: RewardProperty,
};

export function componentOf(
  type: string,
  templateId: string,
  propertyId: string
) {
  switch (type) {
    case "user[]":
      return (
        <MultiUserProperty templateId={templateId} propertyId={propertyId} />
      );
    case "date":
      return <DateProperty templateId={templateId} propertyId={propertyId} />;
    case "singleSelect":
      return (
        <SingleSelectProperty templateId={templateId} propertyId={propertyId} />
      );
    case "reward":
      return <RewardProperty templateId={templateId} propertyId={propertyId} />;
    default:
      return <></>;
  }
}
