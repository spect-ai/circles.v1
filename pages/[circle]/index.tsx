import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import { CircleType, MemberDetails } from "@/app/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const CirclePage: NextPage = () => {
  const router = useRouter();
  const { circle: cId } = router.query;
  useQuery<CircleType>(
    ["circle", cId],
    () =>
      fetch(`${process.env.API_HOST}/circle/slug/${cId as string}`).then(
        (res) => res.json()
      ),
    {
      enabled: !!cId,
    }
  );

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Circle />
      </PublicLayout>
    </>
  );
};

export default CirclePage;
