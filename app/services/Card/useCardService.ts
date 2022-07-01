import { useState } from "react";
import { toast } from "react-toastify";

export default function useCardService() {
  const [updating, setUpdating] = useState(false);
  const [creating, setCreating] = useState(false);

  const callCreateCard = async (payload: any): Promise<any> => {
    setCreating(true);
    const res = await fetch(`${process.env.API_HOST}/card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    setCreating(false);
    if (!res.ok) {
      toast.error("Error creating card");
      return null;
    }
    const data = await res.json();
    return data;
  };

  const updateCard = async (payload: any, cardId: string): Promise<any> => {
    setUpdating(true);
    const res = await fetch(`${process.env.API_HOST}/card/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    setUpdating(false);
    if (!res.ok) {
      toast.error("Error updating card");
      return null;
    }
    const data = await res.json();
    console.log({ data });

    return data;
  };

  return {
    callCreateCard,
    updateCard,
    updating,
    creating,
  };
}

// import { toast } from "react-toastify";
// export const callCreateCard = async (payload: any): Promise<any> => {
//   const res = await fetch(`${process.env.API_HOST}/card`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//     credentials: "include",
//   });

//   if (!res.ok) {
//     toast.error("Error creating card");
//     return null;
//   }
//   const data = await res.json();
//   return data;
// };

// export const updateCard = async (payload: any): Promise<any> => {

// const res = await fetch(`${process.env.API_HOST}/card/${card?.id}`, {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(payload),
//   credentials: "include",
// });
// if(!res.ok){
//   toast.error("Error updating card");
//   return null;
// }
// const data = await res.json();
// return data;
//   // .then(async (res) => {
//   //   if (!res.ok) {
//   //     throw new Error("Error updating card");
//   //   }
//   //   const data = await res.json();
//   //   setCard(data);
//   //   console.log("update complete");
//   //   setUpdating(false);
//   // })
//   // .catch((err) => {
//   //   console.log({ err });
//   //   setUpdating(false);
//   //   toast.error("Error updating card", { theme: "dark" });
//   // });
// }
