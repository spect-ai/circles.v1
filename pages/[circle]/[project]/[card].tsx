import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Card from "@/app/modules/Card";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import {
  LocalCardContext,
  useProviderLocalCard,
} from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { CircleType, MemberDetails, ProjectType, Registry } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

const CardPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: project, refetch: refetchProject } = useQuery<ProjectType>(
    ["project", pId],
    () =>
      fetch(`${process.env.API_HOST}/project/v1/slug/${pId as string}`, {
        credentials: "include",
      }).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );
  const { data: circle, refetch: refetchCircle } = useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/v1/slug/${cId as string}`).then(
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
      void refetchCircle();
      void fetchRegistry();
    }
  }, [circle, cId, refetchCircle]);

  useEffect(() => {
    if (circle?.id) {
      void fetchMemberDetails();
    }
  }, [circle?.id, fetchMemberDetails]);

  useEffect(() => {
    if (!project && pId) {
      void refetchProject();
    }
  }, [project, pId, refetchProject]);

  const context = useProviderLocalCard({ createCard: false });
  const circlecontext = useProviderCircleContext();

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <CircleContext.Provider value={circlecontext}>
        <LocalCardContext.Provider value={context}>
          <PublicLayout>
            <Card />
          </PublicLayout>
        </LocalCardContext.Provider>
      </CircleContext.Provider>
    </>
  );
};

export default CardPage;
