export const joinCircleFromInvite = async (
  circleId: string,
  inviteCode: string
) => {
  const response = await fetch(
    `http://localhost:3000/circle/joinUsingInvitation/${circleId}`,
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
