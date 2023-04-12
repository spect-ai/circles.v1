import { CollectionType, GuildRole } from "@/app/types";
import { toast } from "react-toastify";

export const updateCollection = async (
  collectionUpdate: Partial<CollectionType>,
  collectionId: string
) => {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v1/${collectionId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(collectionUpdate),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    toast("Updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating, please refresh and try again", {
      theme: "dark",
    });
    return false;
  }
};
