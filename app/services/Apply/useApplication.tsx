import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { MemberDetails } from "@/app/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

type PickApplicationDTO = {
  applicationIds: string[];
};

export default function useApplication() {
  const [loading, setLoading] = useState(false);
  const { card, setCard } = useLocalCard();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { refetch: fetchMemberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  const pickApplications = async (
    body: PickApplicationDTO
  ): Promise<boolean> => {
    setLoading(true);
    const res = await fetch(
      `${process.env.API_HOST}/card/${card?.id}/pickApplications`,
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
      toast("Application accepted successfully", {
        theme: "dark",
      });
      void fetchMemberDetails();
      return true;
    } else {
      toast.error("Error accepting application", {
        theme: "dark",
      });
      return false;
    }
  };

  return {
    pickApplications,
    loading,
  };
}
