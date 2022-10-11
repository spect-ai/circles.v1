import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProfileUpdate from "../Profile/useProfileUpdate";

export default function useConnectDiscord() {
  const router = useRouter();
  const { code } = router.query;

  const { updateProfile } = useProfileUpdate();

  const fetchDiscordUser = async () => {
    if (!code) return;
    const res = await fetch(
      `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
    );
    if (res.ok) {
      const data = await res.json();
      const profileRes = await updateProfile({
        discordId: data.userData.id,
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
