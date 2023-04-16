import { logError } from "@/app/common/utils/utils";
import { CardType } from "@/app/types";
import { toast } from "react-toastify";

export const getLensProfileHandles = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/lensHandles`, {
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data.data.profiles.items;
  }
  logError("Error getting profile handles");
  return null;
};

export const updateProfileData = async (body: object) => {
  const res = await fetch(`${process.env.API_HOST}/user/lensHandles`, {
    credentials: "include",
    method: "PATCH",
  });
  console.log(res);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error updating profile handles");
  return null;
};
