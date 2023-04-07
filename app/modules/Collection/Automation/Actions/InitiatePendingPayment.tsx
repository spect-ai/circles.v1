import Dropdown from "@/app/common/components/Dropdown";
import { Action, CollectionType, Option } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { useState } from "react";

type Props = {
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

const InitiatePendingPayment = ({ setAction, action, collection }: Props) => {
  const [rewardField, setRewardField] = useState(
    action?.data?.rewardField ||
      ({
        value: collection.projectMetadata.payments?.rewardField,
        label: collection.projectMetadata.payments?.rewardField,
      } as Option)
  );
  const [payeeField, setPayeeField] = useState(
    action?.data?.payeeField ||
      ({
        value: collection.projectMetadata.payments?.payeeField,
        label: collection.projectMetadata.payments?.payeeField,
      } as Option)
  );

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
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            initiate: !!(rewardField && payeeField),
            rewardField,
            payeeField,
          },
        });
      }}
    >
      <Stack space="2">
        <Stack>
          <Stack space="1">
            <Text variant="label">
              Payment amount will be taken from the following field (Only reward
              fields are shown)
            </Text>
            <Box>
              <Dropdown
                options={rewardOptions}
                selected={rewardField}
                onChange={(value) => setRewardField(value)}
                multiple={false}
                isClearable={false}
                placeholder="Set reward field"
                portal={false}
              />
            </Box>
          </Stack>
          <Stack space="1">
            <Text variant="label">
              Payee will be added from the following field (Only user &
              ethAddress fields are shown)
            </Text>
            <Box>
              <Dropdown
                options={payeeOptions}
                selected={payeeField}
                onChange={(value) => setPayeeField(value)}
                multiple={false}
                isClearable={false}
                placeholder="Set reward field"
                portal={false}
              />
            </Box>
          </Stack>
        </Stack>
        <Box marginTop="4">
          {collection.projectMetadata?.payments?.rewardField &&
            collection.projectMetadata?.payments?.payeeField && (
              <Text color="green">
                {`Note: A pending payment will be initiated only if the card has
                values for "${collection.projectMetadata?.payments?.rewardField}" & "${collection.projectMetadata?.payments?.payeeField}" fields.`}
              </Text>
            )}
        </Box>
      </Stack>
    </Box>
  );
};

export default InitiatePendingPayment;
