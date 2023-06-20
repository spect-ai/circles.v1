// import { storeImage } from "@/app/common/utils/ipfs";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import {
  CircleType,
  DiscordFieldFromOauthData,
  GithubFieldFromOauthData,
  UserType,
} from "@/app/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

type ProfileSettingsType = {
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  avatar: string;
  uploading: boolean;
  loading: boolean;
  username: string;
  bio: string;
  isDirty: boolean;
  uploadFile: (file: File) => void;
  onSaveProfile: () => void;
  usernameError: string;
  setUsernameError: React.Dispatch<React.SetStateAction<string>>;
  apiKeys: string[];
  setApiKeys: React.Dispatch<React.SetStateAction<string[]>>;
  verifiedSocials: {
    [key: string]: GithubFieldFromOauthData | DiscordFieldFromOauthData;
  };
  setVerifiedSocials: React.Dispatch<
    React.SetStateAction<{
      [key: string]: GithubFieldFromOauthData | DiscordFieldFromOauthData;
    }>
  >;
};

export const LocalProfileContext = createContext<ProfileSettingsType>(
  {} as ProfileSettingsType
);

export function useProviderLocalProfile() {
  const { data: currentUser, isLoading } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const {
    data: myCircles,
    refetch: fetchCircles,
    isLoading: loadingMyCircles,
  } = useQuery<CircleType[]>(
    "dashboardCircles",
    () =>
      fetch(`${process.env.API_HOST}/user/v1/circles`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [verifiedSocials, setVerifiedSocials] = useState(
    {} as {
      [key: string]: GithubFieldFromOauthData | DiscordFieldFromOauthData;
    }
  );
  const [apiKeys, setApiKeys] = useState([] as string[]);

  const [usernameError, setUsernameError] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  const { updateProfile } = useProfileUpdate();

  const [loading, setLoading] = useState(true);

  const uploadFile = async (file: File) => {
    const storeImage = await (
      await import("@/app/common/utils/ipfs")
    ).storeImage;
    setIsDirty(true);
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file);
      console.log({ imageGatewayURL });
      setAvatar(imageGatewayURL);
      setUploading(false);
    }
  };

  const onSaveProfile = async () => {
    setLoading(true);
    const res = await updateProfile({
      username,
      avatar,
      bio,
      email,
    });
    console.log(res);
    setLoading(false);
    setIsDirty(false);
  };

  useEffect(() => {
    setLoading(true);
    setAvatar(currentUser?.avatar || "");
    setUsername(currentUser?.username || "");
    setBio(currentUser?.bio || "");
    setEmail(currentUser?.email || "");
    setApiKeys(currentUser?.apiKeys || []);

    let verifiedSocials = {} as {
      [key: string]: GithubFieldFromOauthData | DiscordFieldFromOauthData;
    };
    console.log({ currentUser });
    if (currentUser?.discordId && currentUser?.discordUsername) {
      verifiedSocials = {
        ...verifiedSocials,
        discord: {
          id: currentUser?.discordId,
          username: currentUser?.discordUsername,
          avatar: currentUser?.discordAvatar || "",
        } as DiscordFieldFromOauthData,
      };
    }
    if (currentUser?.githubId && currentUser?.githubUsername) {
      verifiedSocials = {
        ...verifiedSocials,
        github: {
          id: currentUser?.githubId,
          login: currentUser?.githubUsername,
          avatar_url: currentUser?.githubAvatar || "",
        } as GithubFieldFromOauthData,
      };
    }
    setVerifiedSocials(verifiedSocials);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isLoading]);

  return {
    uploading,
    setUploading,
    avatar,
    setAvatar,
    username,
    setUsername,
    email,
    setEmail,
    bio,
    setBio,
    loading,
    setLoading,
    isDirty,
    setIsDirty,
    uploadFile,
    onSaveProfile,
    usernameError,
    setUsernameError,
    apiKeys,
    setApiKeys,
    verifiedSocials,
    setVerifiedSocials,
    myCircles,
  };
}
export const useProfile = () => useContext(LocalProfileContext);
