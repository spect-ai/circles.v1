import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Explore from "@/app/modules/Explore";
import { Heading } from "degen";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { dehydrate, QueryClient } from "react-query";

// const fetchCircle = async () =>
//   await (await fetch("http://localhost:3000/circles/allPublicParents")).json();

const Card: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Heading>Card</Heading>
      </PublicLayout>
    </>
  );
};

// export async function getStaticProps() {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery<Circle[]>("circle", fetchCircle);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export default Card;
