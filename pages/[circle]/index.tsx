import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import type { GetStaticPaths, NextPage } from "next";
import { dehydrate, QueryClient } from "react-query";

const CirclePage: NextPage = () => {
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Circle />
      </PublicLayout>
    </>
  );
};

export async function getStaticProps(context: any) {
  const { circle } = context.params;
  if (circle !== "window-provider.js.map") {
    const fetchCircle = async () =>
      await (
        await fetch(`http://localhost:3000/circles/slug/${circle as string}`)
      ).json();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery<Circle[]>("circle", fetchCircle);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } else {
    return {
      props: {
        dehydratedState: {},
      },
    };
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default CirclePage;
