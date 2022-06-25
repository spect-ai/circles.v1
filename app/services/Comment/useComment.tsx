import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useComment() {
  const { card, setCard } = useLocalCard();
  const [loading, setLoading] = useState(false);

  const addComment = async (comment: string): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/addComment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
        }),
        credentials: "include",
      }
    );
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      return true;
    } else {
      console.log("error");
      toast.error("Error adding comment", {
        theme: "dark",
      });
      return false;
    }
  };

  const updateComment = async (
    comment: string,
    commitId: string
  ): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/updateComment?commitId=${commitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
        }),
        credentials: "include",
      }
    );
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      return true;
    } else {
      console.log("error");
      toast.error("Error updating comment", {
        theme: "dark",
      });
      return false;
    }
  };

  const deleteComment = async (commitId: string): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/deleteComment?commitId=${commitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      setCard(data);
      return true;
    } else {
      console.log("error");
      toast.error("Error deleting comment", {
        theme: "dark",
      });
      return false;
    }
  };

  return {
    addComment,
    updateComment,
    deleteComment,
    loading,
  };
}
