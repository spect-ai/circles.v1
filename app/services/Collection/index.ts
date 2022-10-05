export const addField = async (
  collectionId: string,
  name: string,
  type: string
) => {
  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/addProperty`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: collectionId,
          name,
          type,
          isPartOfFormView: false,
        }),
      }
    )
  ).json();
};
