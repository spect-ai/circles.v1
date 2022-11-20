export const getNotifications = async (limit: number, page: number) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/user/v1/notifications?limit=${limit}&page=${page}`,
      {
        credentials: "include",
      }
    )
  ).json();
};
