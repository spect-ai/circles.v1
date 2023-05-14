import { CirclePrivate } from "@/app/types";
import { toast } from "react-toastify";

type UpdatePrivateCirclePropertiesDto = {
  mintkudosApiKey?: string;
  mintkudosCommunityId?: string;
  zealyApiKey?: string;
  zealySubdomain?: string;
};

export type GetPrivateCirclePropertiesDto = {
  circleId?: string;
  mintkudosApiKey?: string;
  mintkudosCommunityId?: string;
};

export const updatePrivateCircleCredentials = async (
  circleId: string | undefined,
  circleUpdate: Partial<UpdatePrivateCirclePropertiesDto>
) => {
  if (!circleId) return;
  const res = await fetch(
    `${process.env.API_HOST}/circle/private/v1/${circleId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(circleUpdate),
      credentials: "include",
    }
  );
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

export const getPrivateCircleCredentials = async (circleId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/private/v1/${circleId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.ok) {
    try {
      const data = await res.json();
      return data;
    } catch (e) {
      return null;
    }
  } else {
    throw new Error("Error fetching circle credentials");
  }
};
