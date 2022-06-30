import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Project from "@/app/modules/Project";
import {
  LocalProjectContext,
  useProviderLocalProject,
} from "@/app/modules/Project/Context/LocalProjectContext";
import ProjectHeading from "@/app/modules/Project/ProjectHeading";
import { CircleType, MemberDetails } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const ProjectPage: NextPage = () => {
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
  useEffect(() => {
    if (!circle && cId) {
      void fetchCircle();
    }
  }, [circle, cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchMemberDetails();
    }
  }, [circle]);

  const context = useProviderLocalProject();

  return (
    <>
      <MetaHead />
      <LocalProjectContext.Provider value={context}>
        <PublicLayout>
          <ProjectHeading />
          <Project />
        </PublicLayout>
      </LocalProjectContext.Provider>
    </>
  );
};

export default ProjectPage;
