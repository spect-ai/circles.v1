import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import Project from "@/app/modules/Project";
import {
  LocalProjectContext,
  useProviderLocalProject,
} from "@/app/modules/Project/Context/LocalProjectContext";
import ProjectHeading from "@/app/modules/Project/ProjectHeading";
import { CircleType, MemberDetails, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
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

  const { refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId}/getRegistry`).then(
        (res) => res.json()
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!circle && cId) {
      void fetchCircle();
      void fetchRegistry();
    }
  }, [circle, cId]);

  useEffect(() => {
    if (circle?.id) {
      void fetchMemberDetails();
    }
  }, [circle]);

  const context = useProviderLocalProject();
  const circlecontext = useProviderCircleContext();

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <CircleContext.Provider value={circlecontext}>
        <LocalProjectContext.Provider value={context}>
          <PublicLayout>
            <ProjectHeading />
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <Project key={pId as string} />
            </AnimatePresence>
          </PublicLayout>
        </LocalProjectContext.Provider>
      </CircleContext.Provider>
    </>
  );
};

export default ProjectPage;
