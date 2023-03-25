import Dropdown from "@/app/common/components/Dropdown";
import Payments from "@/app/modules/CollectionProject/Settings/Payments";
import { Action, CollectionType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function InitiatePendingPayment({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  const [rewardField, setRewardField] = useState(
    action?.data?.rewardField ||
      ({
        value: collection.projectMetadata.payments?.rewardField,
        label: collection.projectMetadata.payments?.rewardField,
      } as any)
  );
  const [payeeField, setPayeeField] = useState(
    action?.data?.payeeField ||
      ({
        value: collection.projectMetadata.payments?.payeeField,
        label: collection.projectMetadata.payments?.payeeField,
      } as any)
  );

  const rewardOptions = collection.propertyOrder
    .map((prop) => {
      if (collection.properties[prop].type === "reward")
        return {
          value: collection.properties[prop].name,
          label: collection.properties[prop].name,
        };
    })
    .filter((x) => x);

  const payeeOptions = collection.propertyOrder
    .map((prop) => {
      const propertyType = collection.properties[prop].type;
      if (["user", "user[]", "ethAddress"].includes(propertyType))
        return {
          value: collection.properties[prop].name,
          label: collection.properties[prop].name,
        };
    })
    .filter((x) => x);

  return (
    <Box
      margin={"2"}
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            initiate: rewardField && payeeField ? true : false,
            rewardField,
            payeeField,
          },
        });
      }}
    >
      <Stack space={"2"}>
        <Stack>
          <Stack space="1">
            <Text variant="label">
              Payment amount will be taken from the following field (Only reward
              fields are shown)
            </Text>
            <Box width="96">
              <Dropdown
                options={rewardOptions as any}
                selected={rewardField}
                onChange={(value) => setRewardField(value)}
                multiple={false}
                isClearable={false}
                placeholder={`Set reward field`}
                portal={false}
              />
            </Box>
          </Stack>
          <Stack space="1">
            <Text variant="label">
              Payee will be added from the following field (Only user &
              ethAddress fields are shown)
            </Text>
            <Box width="96">
              <Dropdown
                options={payeeOptions as any}
                selected={payeeField}
                onChange={(value) => setPayeeField(value)}
                multiple={false}
                isClearable={false}
                placeholder={`Set reward field`}
                portal={false}
              />
            </Box>
          </Stack>
        </Stack>
        <Box marginTop="4">
          {collection.projectMetadata?.payments?.rewardField &&
            collection.projectMetadata?.payments?.payeeField && (
              <Text color={"green"}>
                {`Note: A pending payment will be initiated only if the card has
                values for "${collection.projectMetadata?.payments?.rewardField}" & "${collection.projectMetadata?.payments?.payeeField}" fields.`}
              </Text>
            )}
        </Box>
      </Stack>
    </Box>
  );
}
