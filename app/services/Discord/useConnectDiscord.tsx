import queryClient from "@/app/common/utils/queryClient";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { joinCirclesFromDiscord } from "../JoinCircle";
import useProfileUpdate from "../Profile/useProfileUpdate";
import { logError } from "@/app/common/utils/utils";

export default function useConnectDiscord() {
  const router = useRouter();
  const { code, state } = router.query;

  const fetchDiscordUser = async () => {
    if (!code) return;
    const res = await fetch(
      `${process.env.API_HOST}/user/v1/connectDiscord?code=${code}`,
      {
        credentials: "include",
      }
    );
    if (res.ok) {
      const { profile: data } = await res.json();
      queryClient.setQueryData("getMyUser", data);
      queryClient.refetchQueries("dashboardCircles");
      toast("Successfully linked your Discord account", {
        theme: "dark",
      });
      if (state) {
        void router.push(state as string);
      } else {
        void router.push("/");
      }
    } else {
      // logError("Something went wrong while getting data from the discord bot");
    }
  };
  useEffect(() => {
    if (code) {
      if (window.opener) {
        window.opener.postMessage({ code }, "*");
        window.close();
        return;
      }
      void fetchDiscordUser();
    }
  }, [code]);
}
