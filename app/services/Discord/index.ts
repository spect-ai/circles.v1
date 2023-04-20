import { logError } from "@/app/common/utils/utils";
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
  channelType: ChannelType = ChannelType.GuildText
) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/channels/multiple?guildId=${guildId}&channelType=${channelType}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error getting guild channels");
};
