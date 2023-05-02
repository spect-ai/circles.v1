import EmbedFormLayout from "@/app/common/layout/PublicLayout/EmbedFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import EmbeddedAnalytics from "@/app/modules/Collection/Analytics/EmbeddedAnalytics";
import { NextPage } from "next";

const EmbedFormAnalytics: NextPage = () => {
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
      <EmbedFormLayout>
        <EmbeddedAnalytics />
      </EmbedFormLayout>
    </>
  );
};

export default EmbedFormAnalytics;
