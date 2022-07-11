import { toast } from "react-toastify";

interface CreateWorkThreadDTO {
  name: string;
  status: "accepted" | "inRevision" | "inReview" | "draft";
  content: string;
}

export const createWorkThreadFetch = async (
  cardId: string,
  body: CreateWorkThreadDTO,
  setCard?: (card: any) => void
) => {
  const res = await fetch(
    `${process.env.API_HOST}/card/${cardId}/createWorkThread`,
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
    toast("Submission created successfully", {
      theme: "dark",
    });
    setCard && setCard(data);
    return data;
  } else {
    toast.error("Error creating work thread", {
      theme: "dark",
    });
    return false;
  }
};
