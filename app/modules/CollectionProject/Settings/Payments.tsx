import Dropdown from "@/app/common/components/Dropdown";
import { Option } from "@/app/types";
import { Stack, Text } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  rewardField: Option;
  setRewardField: (value: Option) => void;
  payeeField: Option;
  setPayeeField: (value: Option) => void;
};

const Payments = ({
  rewardField,
  setRewardField,
  payeeField,
  setPayeeField,
}: Props) => {
  const { localCollection: collection } = useLocalCollection();

  const rewardOptions = collection.propertyOrder
    .map((prop) => {
      if (collection.properties[prop].type === "reward") {
        return {
          value: collection.properties[prop].name,
          label: collection.properties[prop].name,
        };
      }
      return null;
    })
    .filter((x) => x);
  const payeeOptions = collection.propertyOrder
    .map((prop) => {
      const propertyType = collection.properties[prop].type;
      if (["user", "user[]", "ethAddress"].includes(propertyType)) {
        return {
          value: collection.properties[prop].name,
          label: collection.properties[prop].name,
        };
      }
      return null;
    })
    .filter((x) => x);
  return (
    <Stack>
      <Stack space="1">
        <Text variant="label">Reward Field</Text>
        <Dropdown
          options={rewardOptions}
          selected={rewardField}
          onChange={(value) => setRewardField(value)}
          multiple={false}
          isClearable={false}
          placeholder="Set reward field"
        />
      </Stack>
      <Stack space="1">
        <Text variant="label">Payee Field</Text>
        <Dropdown
          options={payeeOptions}
          selected={payeeField}
          onChange={(value) => setPayeeField(value)}
          multiple={false}
          isClearable={false}
          placeholder="Set reward field"
        />
      </Stack>
    </Stack>
  );
};

export default Payments;
