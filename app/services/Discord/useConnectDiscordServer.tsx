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
    if (guild_id && circle?.id) {
      console.log(circle.id);
      void updateCircle(
        {
          discordGuildId: guild_id as string,
        },
        circle?.id
      );
      console.log({ guild_id });
      void router.push(`/${cId}`);
    }
  }, [circle?.id, guild_id]);
}
