export const getNotifications = async (limit: number, page: number) => (
  await fetch(
    `${process.env.API_HOST}/user/v1/notifications?limit=${limit}&page=${page}`,
    {
      credentials: "include",
    },
  )
).json();

export const getUnreadNotifications = async () => (
  await fetch(`${process.env.API_HOST}/user/v1/notifications/unread`, {
    credentials: "include",
  })
).json();

export const patchUnreadNotifications = async () => (
  await fetch(`${process.env.API_HOST}/user/v1/notifications/unread`, {
    method: "PATCH",
    credentials: "include",
  })
).json();
