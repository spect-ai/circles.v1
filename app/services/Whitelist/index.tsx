export const isWhitelisted = async (whitelistedFor: string) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/isWhitelisted?for=${whitelistedFor}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
  ).json();
};
