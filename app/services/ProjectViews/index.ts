import { Views } from "@/app/types";
import { toast } from "react-toastify";

// http://localhost:8080/project/62d35ad1f0e56c8baf31a1c9/view/add

export const createViews = async (body: Views, projectId: string) => {
  const res = await fetch(`${process.env.API_HOST}/project/${projectId}/view/add`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error creating views");
  return null;
}