import { toast } from "react-toastify";

export const getGuildRoles = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}api/guildRoles?guildId=${guildId}`,
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

export const fetchGuildChannels = async (guildId: string) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/guildChannels?guildId=${guildId}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error getting guild channels");
};

export const createThread = async (
  taskTitle: string,
  channelId: string,
  userId: string,
  guildId: string
) => {
  const res = await fetch(
    `${process.env.BOT_HOST}/api/createDiscussionThread?guildId=${guildId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        taskTitle,
        channelId,
        userId,
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
