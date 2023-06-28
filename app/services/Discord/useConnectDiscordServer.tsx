import queryClient from "@/app/common/utils/queryClient";
import {
  useCircle,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { updateCircle } from "../UpdateCircle";

export default function useConnectDiscordServer() {
  const router = useRouter();
  const { guild_id, circle: cId, collection: colId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const circlecontext = useProviderCircleContext();

  useEffect(() => {
    const connectServer = async () => {
      if (!guild_id || guild_id === "undefined") return;
      console.log("connected server from circle context");
      const data = await updateCircle(
        {
          discordGuildId: guild_id as string,
        },
        circle?.id as string
      );
      if (data) {
        console.log("connected server");

        circlecontext.setCircleData(data);
        circlecontext.setJustAddedDiscordServer(true);
        queryClient.setQueryData(["circle", cId], data);
        if (window.opener) {
          window.opener.postMessage({ discordGuildId: guild_id }, "*");
          window.close();
          return;
        }
      }
    };
    if (circle?.id && guild_id) void connectServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cId, circle?.id, guild_id]);
}

export function useConnectDiscordServerFromTemplate() {
  const router = useRouter();
  const { guild_id } = router.query;
  useEffect(() => {
    const connectServer = async () => {
      if (!guild_id || guild_id === "undefined") return;
      console.log("connected server from template");

      if (window.opener) {
        window.opener.postMessage({ discordGuildId: guild_id }, "*");
        window.close();
        return;
      }
    };
    if (guild_id) void connectServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guild_id]);
}
