import PublicFormLayout from "@/app/common/layout/PublicLayout/PublicFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import PublicForm from "@/app/modules/PublicForm";
import { NextPage } from "next";
import React from "react";

const FormPage: NextPage = () => {
  // useConnectDiscordServer();
  const context = useProviderCircleContext();
  const profileContext = useProviderLocalProfile();
  return (
    <>
      <MetaHead
        title="Spect Form"
        description="Incentivized forms for your community to collect feedback, run surveys, onboarding, and more."
        image="https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
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

export default React.memo(FormPage);
