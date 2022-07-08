import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import { CircleType, MemberDetails } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const CirclePage: NextPage = () => {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, refetch: fetchCircle } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId as string}`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  const { refetch: fetchMemberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/${circle?.id}/memberDetails?circleIds=${circle?.id}`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useConnectDiscordServer();

  useEffect(() => {
    if (cId) {
      void fetchCircle();
    }
  }, [cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchMemberDetails();
    }
  }, [circle]);

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Circle />
      </PublicLayout>
    </>
  );
};

export default CirclePage;
