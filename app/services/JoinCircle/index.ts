import { toast } from "react-toastify";

export const joinCircleFromInvite = async (
  circleId: string,
  inviteCode: string
) => {
  try {
    const response = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/joinUsingInvitation`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId: inviteCode,
        }),
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const joinCircleFromDiscord = async (circleId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/joinUsingDiscord`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    toast("You have joined circle successfully", {
      theme: "dark",
    });
    console.log({ data });
    return data;
  } else {
    toast.error(
      "Something went wrong, please ensure you have the required role"
    );
    return null;
  }
};
