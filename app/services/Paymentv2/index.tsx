import { toast } from "react-toastify";

type AddPaymentsRequestDto = {
  collectionId: string;
  dataSlugs: string[];
};

export const addPendingPayment = async (
  circleId: string,
  body: AddPaymentsRequestDto
) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/addPendingPayment`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  console.log({ res });
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  }
  toast.error("Error adding to pending payment", {
    theme: "dark",
  });
  return undefined;
};
