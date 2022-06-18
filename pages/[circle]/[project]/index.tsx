import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Project from "@/app/modules/Project";
import {
  LocalProjectContext,
  useProviderLocalProject,
} from "@/app/modules/Project/Context/LocalProjectContext";
import { ProjectType } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { project: pId } = router.query;
  useQuery<ProjectType>(["project", pId], () =>
    fetch(`http://localhost:3000/project/slug/${pId as string}`).then((res) =>
      res.json()
    )
  );

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

// export async function getStaticProps(context: any) {
//   const { project } = context.params;
//   console.log({ project });
//   if (project !== "window-provider.js.map") {
//     const fetchProject = async () =>
//       await (
//         await fetch(`http://localhost:3000/projects/slug/${project as string}`)
//       ).json();
//     const queryClient = new QueryClient();
//     await queryClient.prefetchQuery<Project>("project", fetchProject);

//     return {
//       props: {
//         dehydratedState: dehydrate(queryClient),
//       },
//     };
//   } else {
//     return {
//       props: {
//         dehydratedState: {},
//       },
//     };
//   }
// }

export default ProjectPage;
