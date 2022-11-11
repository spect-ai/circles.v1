import Editor from "@/app/common/components/Editor";
import { timeSince } from "@/app/common/utils/utils";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { CollectionActivity, MappedItem } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import React from "react";

type Props = {
  activities: MappedItem<CollectionActivity>;
  activityOrder: string[];
};

export default function DataActivity({ activities, activityOrder }: Props) {
  const { getMemberDetails } = useModalOptions();
  return (
    <Box>
      <Stack>
        {activityOrder?.map((activityId) => {
          const activity = activities[activityId];
          const actor = getMemberDetails(activity.ref.actor?.id);
          return (
            <Box key={activityId}>
              <Stack
                direction="horizontal"
                align={activity.comment ? "flex-start" : "center"}
              >
                <Avatar
                  label=""
                  placeholder={!actor?.avatar}
                  src={actor?.avatar}
                  address={actor?.ethAddress}
                  size="10"
                />
                <Stack direction={activity.comment ? "vertical" : "horizontal"}>
                  <Text color="accentText" weight="semiBold">
                    {actor?.username}
                  </Text>
                  {activity.comment ? (
                    <Editor value={activity.content} disabled />
                  ) : (
                    <Text color="textSecondary">{activity.content}</Text>
                  )}
                </Stack>
                <Text variant="label">
                  {timeSince(new Date(activity.timestamp))} ago
                </Text>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
