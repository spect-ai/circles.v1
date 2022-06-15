import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import { useGlobalContext } from "@/app/context/globalContext";
import Project from "@/app/modules/Project/Project";
import { ProjectType } from "@/app/types";
import { Box } from "degen";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import styled from "styled-components";

const Container = styled(Box)<{ isSidebarExpanded: boolean }>`
  max-width: ${(props) =>
    props.isSidebarExpanded ? "calc(100vw - 23rem)" : "calc(100vw - 2rem)"};
`;

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { project: pId } = router.query;
  const { isSidebarExpanded } = useGlobalContext();
  useQuery<ProjectType>(["project", pId], () =>
    fetch(`http://localhost:3000/projects/slug/${pId as string}`).then((res) =>
      res.json()
    )
  );
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Container isSidebarExpanded={isSidebarExpanded}>
          <Project />
        </Container>
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
