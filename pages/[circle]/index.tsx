import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import { NextPage } from "next";

const CirclePage: NextPage = () => {
  useConnectDiscordServer();
  const context = useProviderCircleContext();

  return (
    <>
      <MetaHead
        title={"Circle"}
        description={"Circle Description"}
        image={"Circle Avatar"}
      />
      <CircleContext.Provider value={context}>
        <PublicLayout>
          <Circle />
        </PublicLayout>
      </CircleContext.Provider>
    </>
  );
};

export default CirclePage;
