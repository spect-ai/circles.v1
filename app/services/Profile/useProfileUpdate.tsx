import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { toast } from "react-toastify";

interface UpdateProfileDTO {
  username?: string;
  avatar?: string;
  bio?: string;
  email?: string;
  skills?: string[];
  discordId?: string;
  githubId?: string;
}

interface AddExperienceDTO {
  role: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  linkedCredentials?: string;
  lensHandle?: string;
  lensExperienceId?: string;
}

interface UpdateExperienceDto {
  role?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  linkedCredentials?: string;
  lensHandle?: string;
  lensExperienceId?: string;
}

interface AddEducationDTO {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  linkedCredentials?: string;
  lensHandle?: string;
  lensEducationId?: string;
}

interface UpdateEducationDTO {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  linkedCredentials?: string;
  lensHandle?: string;
  lensEducationId?: string;
}

export default function useProfileUpdate() {
  const { userData, setUserData } = useGlobal();

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
    // console.log({ data: await res.json() });

    if (res.ok) {
      const data = await res.json();
      queryClient.setQueryData("getMyUser", data);
      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const addExperience = async (body: AddExperienceDTO) => {
    const res = await fetch(`${process.env.API_HOST}/user/me/addExperience`, {
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
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);

      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const updateExperience = async (
    experienceId: string,
    body: UpdateExperienceDto
  ) => {
    const res = await fetch(
      `${process.env.API_HOST}/user/me/updateExperience?experienceId=${experienceId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);
      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const removeExperience = async (experienceId: string) => {
    const res = await fetch(
      `${process.env.API_HOST}/user/me/removeExperience?experienceId=${experienceId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);

      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const addEducation = async (body: AddEducationDTO) => {
    const res = await fetch(`${process.env.API_HOST}/user/me/addEducation`, {
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
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);

      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const updateEducation = async (
    educationId: string,
    body: UpdateEducationDTO
  ) => {
    const res = await fetch(
      `${process.env.API_HOST}/user/me/updateEducation?educationId=${educationId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);

      return true;
    } else {
      toast.error("Error updating profile", {
        theme: "dark",
      });
      return false;
    }
  };

  const removeEducation = async (educationId: string) => {
    const res = await fetch(
      `${process.env.API_HOST}/user/me/removeEducation?educationId=${educationId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      queryClient.setQueryData("getMyUser", data);
      setUserData(data);

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
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
  };
}
