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
  budget: {
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
