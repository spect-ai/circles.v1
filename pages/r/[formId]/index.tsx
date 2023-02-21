import PublicFormLayout from "@/app/common/layout/PublicLayout/PublicFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import {
  LocalProfileContext,
  useProfile,
  useProviderLocalProfile,
} from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import PublicForm from "@/app/modules/PublicForm";
import useConnectDiscordServer from "@/app/services/Discord/useConnectDiscordServer";
import { NextPage } from "next";

const FormPage: NextPage = () => {
  useConnectDiscordServer();
  const context = useProviderCircleContext();
  const profileContext = useProviderLocalProfile();
  return (
    <>
      <MetaHead
        title={"Circle"}
        description={"Circle Description"}
        image={"Circle Avatar"}
      />
      <LocalProfileContext.Provider value={profileContext}>
        <CircleContext.Provider value={context}>
          <PublicFormLayout>
            <PublicForm />
          </PublicFormLayout>
        </CircleContext.Provider>
      </LocalProfileContext.Provider>
    </>
  );
};

export default FormPage;
