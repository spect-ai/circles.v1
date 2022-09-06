import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { createWorkThreadFetch } from ".";

interface CreateWorkThreadDTO {
  name: string;
  status: "accepted" | "inRevision" | "inReview" | "draft";
  content: string;
}

interface WorkUnitDTO {
  content: string;
  type: "submission" | "revision" | "feedback";
  status?: "accepted" | "inRevision" | "inReview" | "draft";
}

export default function useSubmission() {
  const { card, setCard, cardId } = useLocalCard();
  const [loading, setLoading] = useState(false);
  const updateWorkUnit = async (
    body: WorkUnitDTO,
    workThreadId: string,
    workUnitId: string
  ): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/v1/${card?.id}/updateWorkUnit?threadId=${workThreadId}&workUnitId=${workUnitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      toast("Submission updated successfully", {
        theme: "dark",
      });
      return true;
    } else {
      toast.error("Error updating work thread", {
        theme: "dark",
      });
      return false;
    }
  };

  const createWorkUnit = async (
    body: WorkUnitDTO,
    workThreadId: string
  ): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/v1/${card?.id}/createWorkUnit?threadId=${workThreadId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      if (body.type !== "revision") {
        toast("Success", {
          theme: "dark",
        });
      }
      return true;
    } else {
      toast.error("Error", {
        theme: "dark",
      });
      return false;
    }
  };

  return {
    updateWorkUnit,
    createWorkUnit,
    loading,
  };
}
