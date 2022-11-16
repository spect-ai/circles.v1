import { PublicLayout } from "@/app/common/layout";
import { useGlobal } from "@/app/context/globalContext";
import Dashboard from "@/app/modules/Dashboard";
import { CircleType } from "@/app/types";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const Home: NextPage = () => {
  const { connectedUser } = useGlobal();

  useQuery<CircleType[]>(
    "dashboardCircles",
    () =>
      fetch(`${process.env.API_HOST}/user/v1/${connectedUser}/circles`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: !!connectedUser,
    }
  );

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
