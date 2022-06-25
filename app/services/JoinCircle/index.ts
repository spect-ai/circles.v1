export const joinCircleFromInvite = async (
  circleId: string,
  inviteCode: string
) => {
  const response = await fetch(
    `${process.env.API_HOST}/circle/joinUsingInvitation/${circleId}`,
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
};
