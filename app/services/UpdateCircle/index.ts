import { DiscordRoleMappingType, Payment } from "@/app/types";
import { toast } from "react-toastify";

type CircleUpdateDTO = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  defaultPayment: Payment;
  discordGuildId: string;
  discordToCircleRoles: DiscordRoleMappingType;
  githubRepos: string[];
  gradient: string;
};

export const updateCircle = async (
  circleUpdate: Partial<CircleUpdateDTO>,
  circleId: string
) => {
  const res = await fetch(`${process.env.API_HOST}/circle/${circleId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(circleUpdate),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Circle updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating circle", {
      theme: "dark",
    });
    return false;
  }
};

export const deleteCircle = async (circleId: string) => {
  const res = await fetch(`${process.env.API_HOST}/circle/${circleId}/delete`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Circle deleted successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error deleting circle", {
      theme: "dark",
    });
    return false;
  }
};
