export const addField = async (
  collectionId: string,
  name: string,
  type: string
) => {
  return await (
    await fetch(`${process.env.API_HOST}/${collectionId}/addProperty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: collectionId,
        name,
        type,
        isPartOfFormView: false,
      }),
    })
  ).json();
};
