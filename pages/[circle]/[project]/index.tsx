import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Project from "@/app/modules/Project";
import {
  LocalProjectContext,
  useProviderLocalProject,
} from "@/app/modules/Project/Context/LocalProjectContext";
import { CircleType, ProjectType, UserType } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], () =>
    fetch(`http://localhost:3000/project/slug/${pId as string}`).then((res) =>
      res.json()
    )
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

  const queryClient = useQueryClient();

  const { mutateAsync, data } = useMutation((body: { circleIds: string[] }) => {
    return fetch("http://localhost:3000/circle/getMemberDetailsOfCircles", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });
  });

  useEffect(() => {
    if (!circle) {
      void refetch();
    }
  }, []);

  useEffect(() => {
    if (project) {
      // do we need parents populated??
      const parents = project.parents?.map((parent) => parent.id);
      mutateAsync({
        circleIds: parents,
      })
        .then(async (res) => {
          const data = await res.json();
          queryClient.setQueriesData("memberDetails", data);
          console.log({ data });
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [project]);

  const context = useProviderLocalProject();

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <LocalProjectContext.Provider value={context}>
          <Project />
        </LocalProjectContext.Provider>
      </PublicLayout>
    </>
  );
};

export default ProjectPage;
