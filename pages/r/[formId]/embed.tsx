import EmbedFormLayout from "@/app/common/layout/PublicLayout/EmbedFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import PublicForm from "@/app/modules/PublicForm";
import { NextPage } from "next";

const EmbedPage: NextPage = () => {
  const context = useProviderCircleContext();
  return (
    <>
      <MetaHead
        title={"Spect Form"}
        description={
          "Incentivized forms for communities to collect feedback, run surveys, onboarding, and more."
        }
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <CircleContext.Provider value={context}>
        <EmbedFormLayout>
          <PublicForm embed />
        </EmbedFormLayout>
      </CircleContext.Provider>
    </>
  );
};

export default EmbedPage;
