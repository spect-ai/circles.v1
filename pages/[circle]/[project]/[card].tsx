import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Card from "@/app/modules/Card";
import {
  LocalCardContext,
  useProviderLocalCard,
} from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { CircleType, MemberDetails, ProjectType, UserType } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const CardPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, project: pId, card: tId } = router.query;
  const { data: project, refetch: refetchProject } = useQuery<ProjectType>(
    ["project", pId],
    () =>
      fetch(`http://localhost:3000/project/slug/${pId as string}`).then((res) =>
        res.json()
      ),
    {
      enabled: false,
    }
  );
  useQuery<UserType>(
    ["card", tId],
    () =>
      fetch(
        `http://localhost:3000/card/byProjectAndSlug/${project?.id}/${
          tId as string
        }`
      ).then((res) => res.json()),
    {
      enabled: !!project?.id,
    }
  );
  const { data: circle, refetch: refetchCircle } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`http://localhost:3000/circle/slug/${cId as string}`).then((res) =>
        res.json()
      ),
    {
      enabled: !!cId,
    }
  );

  useQuery<MemberDetails>(
    ["memberDetails", cId],
    () =>
      fetch(
        `http://localhost:3000/circle/${circle?.id}/memberDetails?circleIds=${circle?.id}`
      ).then((res) => res.json()),
    {
      enabled: !!circle?.id,
    }
  );

  useEffect(() => {
    if (!circle && cId) {
      void refetchCircle();
    }
  }, [circle, cId, refetchCircle]);

  useEffect(() => {
    if (!project && pId) {
      void refetchProject();
    }
  }, [project, pId, refetchProject]);

  const context = useProviderLocalCard({ createCard: false });
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <LocalCardContext.Provider value={context}>
          <Card />
        </LocalCardContext.Provider>
      </PublicLayout>
    </>
  );
};

export default CardPage;
