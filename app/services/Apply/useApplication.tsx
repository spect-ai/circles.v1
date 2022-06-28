import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useState } from "react";
import { toast } from "react-toastify";

type ApplyDTO = {
  content: string;
};

export default function useApplication() {
  const [loading, setLoading] = useState(false);
  const { card, setCard } = useLocalCard();

  const pickApplications = async (applicationId: string): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/pickApplications?applicationIds=${applicationId}`,
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
      toast("Application accepted successfully", {
        theme: "dark",
      });
      return true;
    } else {
      toast.error("Error accepting application", {
        theme: "dark",
      });
      return false;
    }
  };

  const createApplication = async (body: ApplyDTO): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/createApplication`,
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
      toast("Application sent successfully", {
        theme: "dark",
      });
      return true;
    } else {
      toast.error("Error sending application", {
        theme: "dark",
      });
      return false;
    }
  };

  return {
    createApplication,
    pickApplications,
    loading,
  };
}
