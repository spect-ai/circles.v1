import { BatchPayInfo } from "@/app/types";
import { toast } from "react-toastify";

export const getAgregatedPaymentInfo = async (
  cards: string[],
  chainId: string
): Promise<BatchPayInfo | undefined> => {
  // convert cards to query params
  const cardIds = cards.map((cardId) => `cardIds=${cardId}`).join("&");
  console.log({ cardIds });
  const res = await fetch(
    `${process.env.API_HOST}/card/aggregatedPaymentInfo?${cardIds}&chainId=${chainId}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return undefined;
};

export const updatePaymentInfo = async (
  cardIds: string[],
  transactionHash: string
) => {
  const res = await fetch(
    `${process.env.API_HOST}/card/updatePaymentInfoAndClose`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardIds,
        transactionHash,
      }),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error updating payment info", {
    theme: "dark",
  });
  return undefined;
};
