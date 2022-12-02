import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { fetchGuildChannels } from "@/app/services/Discord";
import { Action, Option } from "@/app/types";
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
  const [categoreyOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option>(
    action?.data?.selectedCategory || {}
  );

  const { circle } = useCircle();

  useEffect(() => {
    const getGuildChannels = async () => {
      const data = await fetchGuildChannels(
        circle?.discordGuildId,
        "GUILD_CATEGORY"
      );
      const categoryOptions = data.guildChannels?.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      }));
      setCategoryOptions(categoryOptions);
    };
    void getGuildChannels();
  }, [circle?.discordGuildId]);

  return (
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            channelName,
            channelCategory: selectedCategory,
            circleId: circle.id,
          },
        });
      }}
      width="full"
    >
      <Box marginBottom="2">
        <Text variant="label">Channel Category</Text>
      </Box>
      <Dropdown
        options={categoreyOptions}
        selected={selectedCategory}
        onChange={(value) => {
          setSelectedCategory(value);
        }}
        multiple={false}
      />
      <Box marginTop="2">
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
