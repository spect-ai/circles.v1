import queryClient from "@/app/common/utils/queryClient";
import { userDataAtom } from "@/app/state/global";
import { useAtom } from "jotai";

interface UpdateProfileDTO {
  username?: string;
  avatar?: string;
  bio?: string;
  email?: string;
  skills?: string[];
  discordId?: string;
  discordUsername?: string;
  githubId?: string;
}

export default function useProfileUpdate() {
  const [userData, setUserData] = useAtom(userDataAtom);

  const preprocessDate = (date: string) => {
    if (!date) return {};
    const dateParts = date.split("-");
    return {
      year: parseInt(dateParts[0]),
      month: parseInt(dateParts[1]),
      day: parseInt(dateParts[2]),
    };
  };

  const updateProfile = async (body: UpdateProfileDTO) => {
    try {
      const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
        credentials: "include",
      });
      // console.log({ data: await res.json() });
      const data = await res.json();

      if (res.ok) {
        queryClient.setQueryData("getMyUser", data);
        setUserData(data);

        return true;
      } else throw new Error(data?.message);
    } catch (error) {
      console.log({ error });
      const toast = await (await import("react-toastify")).toast;
      toast.error(
        `Error updating profile ${(error as any)?.message || error}`,
        {
          theme: "dark",
        }
      );
      return false;
    }
  };

  const createAPIKey = async () => {
    const res = await fetch(`${process.env.API_HOST}/user/v1/apiKey`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
    console.log({ res });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return false;
    }
  };

  const deleteApiKey = async (apiKey: string) => {
    const res = await fetch(`${process.env.API_HOST}/user/v1/apiKey`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ apiKey }),
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return false;
    }
  };

  return {
    updateProfile,
    preprocessDate,
    createAPIKey,
    deleteApiKey,
  };
}
