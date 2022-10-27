import PublicFormLayout from "@/app/common/layout/PublicLayout/PublicFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import PublicForm from "@/app/modules/PublicForm";
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
        <PublicFormLayout>
          <PublicForm />
        </PublicFormLayout>
      </CircleContext.Provider>
    </>
  );
};

export default CirclePage;
