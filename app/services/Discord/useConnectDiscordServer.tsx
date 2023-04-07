import queryClient from "@/app/common/utils/queryClient";
import { useProviderCircleContext } from "@/app/modules/Circle/CircleContext";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { updateCircle } from "../UpdateCircle";

export default function useConnectDiscordServer() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { guild_id, circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const circlecontext = useProviderCircleContext();

  useEffect(() => {
    const connectServer = async () => {
      if (!guild_id || guild_id === "undefined") return;
      const data = await updateCircle(
        {
          discordGuildId: guild_id as string,
        },
        circle?.id as string
      );
      if (data) {
        circlecontext.setCircleData(data);
        circlecontext.setJustAddedDiscordServer(true);
        queryClient.setQueryData(["circle", cId], data);
        if (window.opener) {
          window.opener.postMessage({ discordGuildId: guild_id }, "*");
          window.close();
        }
      }
    };
    if (circle?.id && guild_id) connectServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cId, circle?.id, guild_id]);
}
