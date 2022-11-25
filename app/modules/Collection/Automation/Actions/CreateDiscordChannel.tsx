import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action } from "@/app/types";
import { Box, Stack, Tag, Text } from "degen";
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
  const [channelName, setSelectedRoles] = useState(
    action?.data?.channelName || ""
  );

  const { circle } = useCircle();

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
    >
      <Box marginBottom="4">
        <Text variant="label">Channel Name</Text>
      </Box>
      <Box marginBottom="4">
        <Text variant="label">Channel Type</Text>
      </Box>
    </Box>
  );
}
