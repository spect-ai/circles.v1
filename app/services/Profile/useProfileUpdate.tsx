import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { LensDate, LensSkills, NFT, VerifiableCredential } from "@/app/types";
import { toast } from "react-toastify";
import { Credential } from "@/app/types";

interface UpdateProfileDTO {
  username?: string;
  avatar?: string;
  bio?: string;
  email?: string;
  skills?: string[];
  discordId?: string;
  githubId?: string;
  lensHandle?: string;
  skillsV2?: LensSkills[];
  twitter?: string;
  github?: string;
  behance?: string;
  website?: string;
  discordUsername?: string;
}

interface AddExperienceDTO {
  jobTitle: string;
  company: string;
  companyLogo?: string;
  description?: string;
  start_date?: LensDate | object;
  end_date?: LensDate | object;
  linkedCredentials?: Credential[];
  currentlyWorking?: boolean;
  nfts?: NFT[];
  poaps?: string[];
}

interface UpdateExperienceDto {
  jobTitle?: string;
  company?: string;
  companyLogo?: string;
  description?: string;
  start_date?: LensDate | object;
  end_date?: LensDate | object;
  linkedCredentials?: Credential[];
  currentlyWorking?: boolean;
  nfts?: NFT[];
  poaps?: string[];
}

interface AddEducationDTO {
  courseDegree: string;
  school: string;
  schoolLogo?: string;
  description?: string;
  start_date?: LensDate | object;
  end_date?: LensDate | object;
  currentlyStudying?: boolean;
  nfts?: NFT[];
  poaps?: string[];
  linkedCredentials?: Credential[];
}

interface UpdateEducationDTO {
  courseDegree?: string;
  school?: string;
  schoolLogo?: string;
  description?: string;
  start_date?: LensDate | object;
  end_date?: LensDate | object;
  currentlyStudying?: boolean;
  nfts?: NFT[];
  poaps?: string[];
  linkedCredentials?: Credential[];
}

export default function useProfileUpdate() {
  const { setProfileLoading, setUserData } = useGlobal();

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
        setUserData(data);

        return true;
      }
    } catch (error) {
      toast.error(`Error updating profile ${error}`, {
        theme: "dark",
      });
      return false;
    }
  };

  const addExperience = async (body: AddExperienceDTO) => {
    console.log(body);
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
    preprocessDate,
  };
}
