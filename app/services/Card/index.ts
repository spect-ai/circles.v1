import { toast } from "react-toastify";
export const callCreateCard = async (payload: any): Promise<any> => {
  const res = await fetch(`${process.env.API_HOST}/card`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    toast.error("Error creating card");
    return null;
  }
  const data = await res.json();
  return data;
};
