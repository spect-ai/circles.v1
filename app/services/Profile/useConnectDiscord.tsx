import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProfileUpdate from "./useProfileUpdate";

export default function useConnectDiscord() {
  const router = useRouter();
  const { code } = router.query;

  const { updateProfile } = useProfileUpdate();

  const fetchDiscordUser = async () => {
    const res = await fetch(
      `http://localhost:3001/api/connectDiscord?code=${code}`
    );
    if (res.ok) {
      const data = await res.json();
      const profileRes = await updateProfile({
        discordId: data.userData.id,
        username: data.userData.username,
        avatar: `https://cdn.discordapp.com/avatars/${data.userData.id}/${data.userData.avatar}.png`,
      });
      console.log({ profileRes });
      if (profileRes) {
        void router.push("/");
        toast("Successfully linked your Discord account", {
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
      void fetchDiscordUser();
    }
  }, [code]);
}
