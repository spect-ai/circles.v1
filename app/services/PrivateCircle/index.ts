import { toast } from "react-toastify";

type CreatePrivateCirclePropertiesDto = {
  circleId: string;
  mintkudosApiKey: string;
  mintkudosCommunityId: string;
};

type UpdatePrivateCirclePropertiesDto = {
  mintkudosApiKey?: string;
  mintkudosCommunityId?: string;
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

export const getPrivateCircleCredentials = async (
  circleId: string
): Promise<GetPrivateCirclePropertiesDto | boolean> => {
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
    const data = await res.json();
    return data;
  } else {
    return false;
  }
};
