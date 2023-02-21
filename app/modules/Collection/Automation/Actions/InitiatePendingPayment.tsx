import { Action, CollectionType } from "@/app/types";
import { Box, Stack, Text } from "degen";

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
  console.log(collection.projectMetadata);
  return (
    <Box
      margin={"2"}
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            initiate:
              collection.projectMetadata?.payments?.rewardField &&
              collection.projectMetadata?.payments?.payeeField
                ? true
                : false,
            rewardField: collection.projectMetadata?.payments?.rewardField,
            payeeField: collection.projectMetadata?.payments?.payeeField,
          },
        });
      }}
    >
      <Stack space={"2"}>
        {!collection.projectMetadata?.payments?.payeeField &&
          collection.projectMetadata?.payments?.rewardField && (
            <Text color={"red"}>
              This collection does not have a payee field set up. Please set up
              the payee field in the collection settings.
            </Text>
          )}
        {!collection.projectMetadata?.payments?.rewardField &&
          collection.projectMetadata?.payments?.payeeField && (
            <Text color={"red"}>
              This collection does not have a reward field set up. Please set up
              the reward field in the collection settings.
            </Text>
          )}
        {!collection.projectMetadata?.payments?.rewardField &&
          !collection.projectMetadata?.payments?.payeeField && (
            <Text color={"red"}>
              Please configure the payee and reward fields in the collection
              settings
            </Text>
          )}
        {collection.projectMetadata?.payments?.rewardField &&
          collection.projectMetadata?.payments?.payeeField && (
            <Text color={"green"}>
              A pending payment will be initiated only if the card has an
              assignee and a reward set up.
            </Text>
          )}
      </Stack>
    </Box>
  );
}
