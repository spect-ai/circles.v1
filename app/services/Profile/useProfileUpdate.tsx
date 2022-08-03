import queryClient from "@/app/common/utils/queryClient";
import { toast } from "react-toastify";

interface UpdateProfileDTO {
  username: string;
  avatar: string;
  bio: string;
  skills: string[];
  discordId?: string;
  githubId?: string;
}

export default function useProfileUpdate() {
  const updateProfile = async (body: UpdateProfileDTO) => {
    const res = await fetch(`${process.env.API_HOST}/user/me`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      queryClient.setQueryData("getMyUser", data);
      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  return {
    updateProfile,
  };
}
