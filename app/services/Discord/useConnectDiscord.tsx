import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCirclesFromDiscord } from "../JoinCircle";
import useProfileUpdate from "../Profile/useProfileUpdate";

export default function useConnectDiscord() {
  const router = useRouter();
  const { code, state } = router.query;

  const { updateProfile } = useProfileUpdate();

  const fetchDiscordUser = async () => {
    if (!code) return;
    const res = await fetch(
      `${process.env.BOT_HOST}/api/connectDiscord?code=${code}`
    );
    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      const profileRes = await updateProfile({
        discordId: data.userData.id,
        discordUsername:
          data.userData.username === undefined
            ? undefined
            : data.userData.username + "#" + data.userData.discriminator,
      });
      await joinCirclesFromDiscord(data.guildData, data.userData.id);
      if (profileRes) {
        toast("Successfully linked your Discord account", {
          theme: "dark",
        });
        if (state) {
          void router.push(state as string);
        } else {
          void router.push("/");
        }
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
