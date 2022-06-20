export const joinCircleFromInvite = async (
  circleId: string,
  inviteCode: string
) => {
  const response = await fetch(
    `http://localhost:3000/circle/join/${circleId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId: inviteCode,
        joinUsing: "invitation",
      }),
      credentials: "include",
    }
  );
  const data = await response.json();
  return data;
};
