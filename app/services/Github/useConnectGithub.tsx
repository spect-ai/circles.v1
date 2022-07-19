import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProfileUpdate from "../Profile/useProfileUpdate";

export default function useConnectGithub() {
  const router = useRouter();
  const { code } = router.query;

  const { updateProfile } = useProfileUpdate();

  const fetchGithubUser = async () => {
    const res = await fetch(`http://localhost:3001/connectGithub?code=${code}`);
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      const profileRes = await updateProfile({
        githubId: data.userData.id.toString(),
        username: data.userData.login,
        avatar: data.userData.avatar_url,
      });
      console.log({ profileRes });
      if (profileRes) {
        void router.push("/");
        toast("Successfully linked your Github account", {
          theme: "dark",
        });
      }
    } else {
      toast.error(
        "Something went wrong while getting data from the discord bot",
        { theme: "dark" }
      );
    }
  };
  useEffect(() => {
    if (code) {
      void fetchGithubUser();
    }
  }, [code]);
}
