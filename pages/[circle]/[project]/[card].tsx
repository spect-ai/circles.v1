import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Card from "@/app/modules/Card";
import type { NextPage } from "next";

const CardPage: NextPage = () => {
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Card />
      </PublicLayout>
    </>
  );
};

export default CardPage;
