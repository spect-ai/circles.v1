import { logError } from "@/app/common/utils/utils";
import { toast } from "react-toastify";

export const guildIsConnected = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guildExists?guildId=${guildId}`,
    {
      method: "GET",
    }
  );
  if (res.ok) {
    return true;
  }
  return false;
};

export const getGuildRoles = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guildRoles?guildId=${guildId}`,
    {
      method: "GET",
    }
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
  channelType?: string
) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guildChannels?guildId=${guildId}&channelType=${channelType}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error getting guild channels");
};
