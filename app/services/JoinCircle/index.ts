export const joinCircleFromInvite = async (
  circleId: string,
  inviteCode: string
) => {
  try {
    const response = await fetch(
      `${process.env.API_HOST}/circle/${circleId}/joinUsingInvitation`,
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
