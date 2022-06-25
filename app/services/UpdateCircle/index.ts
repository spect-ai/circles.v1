import { Payment } from "@/app/types";
import { toast } from "react-toastify";

type CircleUpdateDTO = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  defaultPayment: Payment;
};

export const updateCircle = async (
  circleUpdate: Partial<CircleUpdateDTO>,
  circleId: string
) => {
  const res = await fetch(`http://localhost:3000/circle/${circleId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(circleUpdate),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Circle updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating circle", {
      theme: "dark",
    });
    return false;
  }
};
