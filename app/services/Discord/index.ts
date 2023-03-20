import { toast } from "react-toastify";

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
  toast.error("Error getting guild roles");
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
  toast.error("Error getting guild channels");
};

export const createThread = async (
  guildId: string,
  threadName: string,
  channelId: string,
  isPrivate: boolean,
  usersToAdd: string[],
  rolesToAdd: string[]
) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/createDiscussionThread?guildId=${guildId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        threadName,
        channelId,
        usersToAdd,
        rolesToAdd,
        isPrivate,
      }),
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error creating thread");
  return null;
};
