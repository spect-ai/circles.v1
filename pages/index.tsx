import { PublicLayout } from "@/app/common/layout";
import Explore from "@/app/modules/Explore";
import { Box } from "degen";
import type { NextPage } from "next";
import { dehydrate, QueryClient } from "react-query";
import MetaHead from "../app/common/SEO/MetaHead/MetaHead";

const fetchCircle = async () =>
  await (await fetch("http://localhost:3000/circles/allPublicParents")).json();

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
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<Circle[]>("circle", fetchCircle);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Home;
