import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { fetchGuildChannels, guildIsConnected } from "@/app/services/Discord";
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

export default function PostCardOnDiscord({
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
  const [title, setTitle] = useState(action?.data?.title || "");
  const [fields, setFields] = useState(action?.data?.fields || "");
  const [discordIsConnected, setDiscordIsConnected] = useState(false);

  const { circle, justAddedDiscordServer } = useCircle();
  const { hostname } = useLocation();

  useEffect(() => {
    if (circle?.discordGuildId) {
      const discordIsConnected = async () => {
        const res = await guildIsConnected(circle?.discordGuildId);
        console.log({ res });
        setDiscordIsConnected(res);
      };
      void discordIsConnected();
    }
  }, [circle?.discordGuildId, justAddedDiscordServer]);

  useEffect(() => {
    if (discordIsConnected && circle?.discordGuildId) {
      const getGuildChannels = async () => {
        const channels = await fetchGuildChannels(circle?.discordGuildId);
        const categoryOptions = channels?.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }));
        setChannelOptions(categoryOptions);
      };
      if (circle?.discordGuildId) void getGuildChannels();
    }
  }, [discordIsConnected]);

  if (!discordIsConnected)
    return (
      <Box
        width="48"
        paddingTop="4"
        onClick={() => {
          window.open(
            `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=17448306704&redirect_uri=${origin}/api/connectDiscord&response_type=code&scope=bot&state=${circle?.slug}/r/${collection.slug}`,
            "popup",
            "width=600,height=600"
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
            url: `https://${hostname}/${circle?.slug}/r/${collection?.slug}?cardSlug=`,
            channel: selectedChannel,
            title,
            message,
            fields,
          },
        });
      }}
      width="full"
    >
      <Box>
        <Text variant="label">Channel Name</Text>
      </Box>
      <Dropdown
        options={channelOptions}
        selected={selectedChannel}
        onChange={(value) => {
          setSelectedChannel(value);
        }}
        multiple={false}
        portal={false}
      />
      <Box marginTop="4" marginBottom="2">
        <Text variant="label">Message</Text>
      </Box>
      <Input
        label
        hideLabel
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="A new fren has joined us. Let's welcome them!"
      />
      <Box marginTop="4">
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
        portal={false}
      />
    </Box>
  );
}
