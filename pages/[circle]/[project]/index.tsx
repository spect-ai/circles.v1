import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Project from "@/app/modules/Project";
import {
  LocalProjectContext,
  useProviderLocalProject,
} from "@/app/modules/Project/Context/LocalProjectContext";
import { CircleType, MemberDetails, ProjectType } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  useQuery<ProjectType>(
    ["project", pId],
    () =>
      fetch(`http://localhost:3000/project/slug/${pId as string}`).then((res) =>
        res.json()
      ),
    {
      enabled: pId !== undefined,
    }
  );
  const { data: circle, refetch } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`http://localhost:3000/circle/slug/${cId as string}`).then((res) =>
        res.json()
      ),
    {
      enabled: false,
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
      void refetch();
    }
  }, [circle, refetch, cId]);

  const context = useProviderLocalProject();

  return (
    <>
      <MetaHead />
      <LocalProjectContext.Provider value={context}>
        <PublicLayout>
          <Project />
        </PublicLayout>
      </LocalProjectContext.Provider>
    </>
  );
};

export default ProjectPage;
