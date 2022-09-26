import { CardType } from "@/app/types";
import { toast } from "react-toastify";

export const getGuildRoles = async (guildId: string) => {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "production"
        ? "https://spect-discord-bot.herokuapp.com/"
        : "https://spect-discord-bot.herokuapp.com/"
    }api/guildRoles?guildId=${guildId}`,
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
    "https://spect-discord-bot.herokuapp.com/api/guildChannels?guildId=" +
      guildId
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
    `https://spect-discord-bot.herokuapp.com/api/createDiscussionThread?guildId=${guildId}`,
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
