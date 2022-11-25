import EmbedFormLayout from "@/app/common/layout/PublicLayout/EmbedFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import PublicForm from "@/app/modules/PublicForm";
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import { NextPage } from "next";

const EmbedPage: NextPage = () => {
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
        <EmbedFormLayout>
          <PublicForm />
        </EmbedFormLayout>
      </CircleContext.Provider>
    </>
  );
};

export default EmbedPage;
