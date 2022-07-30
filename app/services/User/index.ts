import { toast } from "react-toastify";


export async function getUser(userId: string){
  const res = await fetch(
    `${process.env.API_HOST}/user/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error getting user info");
  return null;
}