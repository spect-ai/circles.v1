import { PublicLayout } from "@/app/common/layout";
import Explore from "@/app/modules/Explore";
import { Box } from "degen";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
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
    await (
      await fetch("http://localhost:3000/circles/allPublicParents")
    ).json();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<Circle[]>(
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
