import { PublicLayout } from "@/app/common/layout";
import Explore from "@/app/modules/Explore";
import { CircleType } from "@/app/types";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
  useQuery<CircleType>("exploreCircles", () =>
    fetch(`${process.env.API_HOST}/circle/allPublicParents`).then((res) =>
      res.json()
    )
  );

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Explore />
      </PublicLayout>
    </>
  );
};

export default Home;
