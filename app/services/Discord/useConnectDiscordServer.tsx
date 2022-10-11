import queryClient from "@/app/common/utils/queryClient";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { updateCircle } from "../UpdateCircle";

export default function useConnectDiscordServer() {
  const router = useRouter();
  const { guild_id, circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  useEffect(() => {
    const connectServer = async () => {
      if (!guild_id || guild_id === "undefined") return;
      const data = await updateCircle(
        {
          discordGuildId: guild_id as string,
        },
        circle?.id as string
      );
      queryClient.setQueryData(["circle", cId], data);
      void router.push(`/${cId}`);
    };
    if (circle?.id && guild_id) void connectServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cId, circle?.id, guild_id]);
}
