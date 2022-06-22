import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useState } from "react";
import { toast } from "react-toastify";

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
  const { card, setCard } = useLocalCard();
  const [loading, setloading] = useState(false);

  const createWorkThread = async (
    body: CreateWorkThreadDTO
  ): Promise<boolean> => {
    setloading(true);
    const res = await fetch(
      `http://localhost:3000/card/${card?.id}/createWorkThread`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    setloading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      toast("Submission created successfully", {
        theme: "dark",
      });
      return true;
    } else {
      toast.error("Error creating work thread", {
        theme: "dark",
      });
      return false;
    }
  };

  const updateWorkUnit = async (
    body: WorkUnitDTO,
    workThreadId: string,
    workUnitId: string
  ): Promise<boolean> => {
    setloading(true);
    const res = await fetch(
      `http://localhost:3000/card/${card?.id}/updateWorkUnit?threadId=${workThreadId}&workUnitId=${workUnitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    setloading(false);
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
    setloading(true);
    const res = await fetch(
      `http://localhost:3000/card/${card?.id}/createWorkUnit?threadId=${workThreadId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    setloading(false);
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
    createWorkThread,
    updateWorkUnit,
    createWorkUnit,
    loading,
  };
}
