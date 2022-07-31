import { Chain, Token } from "@/app/types";
import { toast } from "react-toastify";

type CreateRetroDTO = {
  title: string;
  description: string;
  circle: string;
  strategy: string;
  startTime: string;
  duration: number;
  memberStats: {
    member: string;
    canGive: boolean;
    canReceive: boolean;
    allocation: number;
  }[];
  reward: {
    chain: Chain;
    token: Token;
    value: number;
  };
};

export const createRetro = async (retro: Partial<CreateRetroDTO>) => {
  const res = await fetch(`${process.env.API_HOST}/retro`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(retro),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Retro created successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error creating retro", {
      theme: "dark",
    });
    return false;
  }
};

export const addVotes = async (
  retroId: string,
  votes: {
    votes:
      | {
          [userId: string]: number;
        }
      | undefined;
  }
) => {
  const res = await fetch(`${process.env.API_HOST}/retro/${retroId}/vote`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(votes),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Votes saved successfully", {
      theme: "dark",
    });
    console.log({ data });
    return data;
  } else {
    toast("Error saving votes", {
      theme: "dark",
    });
    return false;
  }
};

export const giveFeedback = async (
  retroId: string,
  feedback: {
    feedback: {
      [key: string]: string;
    };
  }
) => {
  const res = await fetch(
    `${process.env.API_HOST}/retro/${retroId}/giveFeedback`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(feedback),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    toast("Error sending feedback", {
      theme: "dark",
    });
    return false;
  }
};

export const endRetro = async (retroId: string) => {
  const res = await fetch(`${process.env.API_HOST}/retro/${retroId}/endRetro`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Retro ended successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error ending retro", {
      theme: "dark",
    });
    return false;
  }
};
