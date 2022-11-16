import { PublicLayout } from "@/app/common/layout";
import Dashboard from "@/app/modules/Dashboard";
import type { NextPage } from "next";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
  return (
    <>
      <MetaHead
        title="Spect Circles"
        description="Playground of coordination tools for DAO contributors to manage projects and fund each other"
        image="/og.jpg"
      />
      <PublicLayout>
        <Dashboard />
      </PublicLayout>
    </>
  );
};

export default Home;
