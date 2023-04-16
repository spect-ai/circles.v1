import { logError } from "@/app/common/utils/utils";
import { BatchPayInfo } from "@/app/types";
import { toast } from "react-toastify";

type AddTokenDTO = {
  chainId: string;
  address: string;
  symbol: string;
  name: string;
};

type ReturnWithType = {
  type: "circle" | "project";
  id?: string;
  filter?: object;
};

export const getAgregatedPaymentInfo = async (
  cards: string[],
  chainId: string,
  payCircle: boolean
): Promise<BatchPayInfo | undefined> => {
  // convert cards to query params
  const cardIds = cards.map((cardId) => `cardIds=${cardId}`).join("&");
  console.log({ cardIds });
  const res = await fetch(
    `${process.env.API_HOST}/card/aggregatedPaymentInfo?${cardIds}&chainId=${chainId}&payCircle=${payCircle}`
  );
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data;
  }
  return undefined;
};

export const updatePaymentInfo = async (
  cardIds: string[],
  transactionHash: string,
  returnWith?: ReturnWithType
) => {
  const res = await fetch(
    `${process.env.API_HOST}/card/v1/updatePaymentInfoAndClose`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardIds,
        transactionHash,
        returnWith,
      }),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  logError("Error updating payment info");
  return undefined;
};

export const addToken = async (circleId: string, body: AddTokenDTO) => {
  // TODO
  const res = await fetch(
    `${process.env.API_HOST}/circle/${circleId}/addToken`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  logError("Error updating adding token");
  return undefined;
};
