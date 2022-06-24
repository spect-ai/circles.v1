import { PublicLayout } from "@/app/common/layout";
import { useGlobalContext } from "@/app/context/globalContext";
import Explore from "@/app/modules/Explore";
import { CircleType } from "@/app/types";
import type { NextPage } from "next";
import { useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
  const { setIsSidebarExpanded } = useGlobalContext();
  useEffect(() => {
    setIsSidebarExpanded(false);
  }, [setIsSidebarExpanded]);

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Explore />
      </PublicLayout>
    </>
  );
};

export async function getStaticProps() {
  const fetchExploreCircles = async () =>
    await (await fetch("http://localhost:3000/circle/allPublicParents")).json();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<CircleType[]>(
    "exploreCircles",
    fetchExploreCircles
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Home;
