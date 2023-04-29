import { logError } from "@/app/common/utils/utils";
import { Option } from "@/app/types";
import { ChannelType } from "discord-api-types/v10";
import { toast } from "react-toastify";

export const guildIsConnected = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guilds/${guildId}/exists`
  );
  if (res.ok) {
    return true;
  }
  return false;
};

export const getGuildRoles = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guilds/${guildId}/roles`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error getting guild roles");
  return null;
};

export const fetchGuildChannels = async (
  guildId: string,
  channelType: ChannelType = ChannelType.GuildText,
  returnPlayground?: boolean
) => {
  let url = "";
  if (returnPlayground) {
    url = `${process.env.BOT_HOST}/api/channels/multiple?guildId=${guildId}&channelType=${channelType}&returnPlayground=true`;
  } else {
    url = `${process.env.BOT_HOST}/api/channels/multiple?guildId=${guildId}&channelType=${channelType}`;
  }
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error getting guild channels");
};

export const groupChannelsByCategory = (channels: Option[]) => {
  const playgroundChannels = [];
  const serverChannels = [];
  for (const channel of channels) {
    if (channel.value === process.env.NEXT_PUBLIC_DISCORD_PLAYGROUND_CHANNEL) {
      playgroundChannels.push(channel);
    } else {
      serverChannels.push(channel);
    }
  }
  return [
    {
      label: "Channels that Spect bot can view on connected server",
      options: serverChannels,
    },
    {
      label: "Playground channels for testing",
      options: playgroundChannels,
    },
  ];
};
