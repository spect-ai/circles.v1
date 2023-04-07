const isWhitelisted = async (whitelistedFor: string) =>
  (
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

export default isWhitelisted;
