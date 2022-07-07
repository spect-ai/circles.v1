import { CardType } from "@/app/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useCardService() {
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);

  const callCreateCard = async (payload: any): Promise<any> => {
    setCreating(true);
    const res = await fetch(`${process.env.API_HOST}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    setCreating(false);
    if (!res.ok) {
      toast.error("Error creating card");
      return null;
    }
    const data = await res.json();
    return data;
  };

  const updateCard = async (
    payload: Partial<CardType>,
    cardId: string
  ): Promise<CardType | null> => {
    setUpdating(true);
    const res = await fetch(`${process.env.API_HOST}/card/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    setUpdating(false);
    if (!res.ok) {
      toast.error("Error updating card");
      return null;
    }
    const data = await res.json();
    console.log({ data });

    return data;
  };

  const archiveCard = async (cardId: string): Promise<any> => {
    setUpdating(true);
    const res = await fetch(`${process.env.API_HOST}/card/${cardId}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setUpdating(false);
    if (res.ok) {
      void router.push(`/${cId}/${pId}`);
      const data = await res.json();
      console.log({ data });
      return data;
    }
    toast.error("Error archiving card");
    return null;
  };

  return {
    callCreateCard,
    updateCard,
    archiveCard,
    updating,
    creating,
  };
}
