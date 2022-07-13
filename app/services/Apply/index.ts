import { CardType } from "@/app/types";
import { toast } from "react-toastify";

type ApplyDTO = {
  title: string;
  content: string;
};

export const createApplicationFetch = async (
  cardId: string,
  body: ApplyDTO,
  setCard: (card: CardType) => void
): Promise<boolean> => {
  const res = await fetch(
    `${process.env.API_HOST}/card/${cardId}/createApplication`,
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
    toast("Application sent successfully", {
      theme: "dark",
    });
    setCard && setCard(data);
    return true;
  } else {
    toast.error("Error sending application", {
      theme: "dark",
    });
    return false;
  }
};
