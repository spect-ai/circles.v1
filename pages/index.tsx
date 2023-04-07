import { PublicLayout } from "@/app/common/layout";
import Dashboard from "@/app/modules/Dashboard";
import type { NextPage } from "next";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
  useConnectDiscord();
  return (
    <>
      <MetaHead
        title="Spect"
        description="Playground of coordination tools for you & your frens to build the next big thing."
        image="/og.jpg"
      />
      <PublicLayout>
        <Dashboard />
      </PublicLayout>
    </>
  );
};

export default Home;
