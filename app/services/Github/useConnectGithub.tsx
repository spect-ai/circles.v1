import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProfileUpdate from "../Profile/useProfileUpdate";

export default function useConnectGithub() {
  const router = useRouter();
  const { code } = router.query;

  const { updateProfile } = useProfileUpdate();

  const fetchGithubUser = async () => {
    const res = await fetch(
      `${process.env.BOT_HOST}/connectGithub?code=${code}`
    );
    if (res.ok) {
      const data = await res.json();
      const profileRes = await updateProfile({
        githubId: data.userData.login,
      });
      if (profileRes) {
        router.push("/");
        toast("Successfully linked your Github account", {
          theme: "dark",
        });
      }
    } else {
      toast.error(
        "Something went wrong while getting data from the GitHub bot",
        { theme: "dark" }
      );
    }
  };
  useEffect(() => {
    if (code) {
      if (window.opener) {
        window.opener.postMessage({ code }, "*");
        window.close();
        return;
      }
      fetchGithubUser();
    }
  }, [code]);
}
