import { PublicLayout } from "@/app/common/layout";
import Dashboard from "@/app/modules/Dashboard";
import { BucketizedCircleType, CircleType } from "@/app/types";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Explore from "@/app/modules/Explore";


const ExplorePage: NextPage = () => {
  useQuery<BucketizedCircleType>("exploreCircles", () =>
    fetch(`${process.env.API_HOST}/circle/v1/allPublicParents`, {
      credentials: "include",
    }).then((res) => res.json())
  );

  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <PublicLayout>
        <Explore />
      </PublicLayout>
    </>
  );
};

export default ExplorePage;
