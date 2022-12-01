import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action } from "@/app/types";
import { Box, Input, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function CreateDiscordChannel({
  setAction,
  actionMode,
  action,
}: Props) {
  const [channelName, setChannelName] = useState(
    action?.data?.channelName || ""
  );

  return (
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            channelName,
          },
        });
      }}
      width="full"
    >
      <Box>
        <Text variant="label">Channel Name</Text>
      </Box>
      <Input
        label=""
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
    </Box>
  );
}
