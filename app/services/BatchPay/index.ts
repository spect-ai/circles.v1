import { BatchPayInfo } from "@/app/types";

export const getAgregatedPaymentInfo = async (
  cards: string[],
  chainId: string
): Promise<BatchPayInfo | undefined> => {
  // convert cards to query params
  const cardIds = cards.map((cardId) => `cardIds=${cardId}`).join("&");
  console.log({ cardIds });
  const res = await fetch(
    `http://localhost:3000/card/aggregatedPaymentInfo?${cardIds}&chainId=${chainId}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return undefined;
};
