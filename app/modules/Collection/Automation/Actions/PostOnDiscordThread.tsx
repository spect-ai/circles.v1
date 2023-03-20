import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { fetchGuildChannels } from "@/app/services/Discord";
import { Action, CollectionType, Option } from "@/app/types";
import { Box, Input, Text } from "degen";
import { useEffect, useState } from "react";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import { useLocation } from "react-use";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function PostCardOnDiscordThread({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  const { origin } = useLocation();
  const [channelOptions, setChannelOptions] = useState<Option[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Option>(
    action?.data?.channel || {}
  );
  const [message, setMessage] = useState(action?.data?.message || "");
  const [fields, setFields] = useState(action?.data?.fields || "");

  const { circle } = useCircle();
  const { hostname } = useLocation();

  useEffect(() => {
    const getGuildChannels = async () => {
      const data = await fetchGuildChannels(circle?.discordGuildId || "");
      const categoryOptions = data.guildChannels?.map((channel: any) => ({
        label: channel.name,
        value: channel.id,
      }));
      setChannelOptions(categoryOptions);
    };
    if (circle?.discordGuildId) void getGuildChannels();
  }, [circle?.discordGuildId]);

  if (!circle?.discordGuildId)
    return (
      <Box
        width={{
          xs: "full",
          md: "1/2",
        }}
        onClick={() => {
          window.open(
            `https://discord.com/oauth2/authorize?client_id=942494607239958609&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
            "_blank"
          );
        }}
      >
        <PrimaryButton
          icon={
            <Box marginTop="1">
              <DiscordIcon />
            </Box>
          }
        >
          Connect Discord
        </PrimaryButton>
      </Box>
    );

  return (
    <Box
      marginTop="2"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            circleId: circle?.id,
            channel: selectedChannel,
            message,
            fields,
          },
        });
      }}
      width="full"
    >
      <Box marginY="2">
        <Text variant="label">Message</Text>
      </Box>
      <Input
        label
        hideLabel
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Card status has been updated."
      />
      <Box marginY="2">
        <Text variant="label">
          Select the properties you'd like to add in the post
        </Text>
      </Box>
      <Dropdown
        options={
          Object.entries(collection.properties)
            .filter(
              ([propertyId, property]) =>
                property.type === "shortText" ||
                property.type === "singleSelect" ||
                property.type === "email" ||
                property.type === "date" ||
                property.type === "ethAddress"
            )
            .map(([propertyId, property]) => ({
              label: property.name,
              value: property.name,
            })) || []
        }
        selected={fields}
        onChange={(f) => {
          setFields(f);
        }}
        multiple={true}
      />
    </Box>
  );
}
