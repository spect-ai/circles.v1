import EmbedFormLayout from "@/app/common/layout/PublicLayout/EmbedFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import { NextPage } from "next";

const EmbedCirclePage: NextPage = () => {
  const context = useProviderCircleContext();
  return (
    <>
      <MetaHead
        title={"Spect Space"}
        description={
          "A place for you and your frens to coordinate and build the next big thing."
        }
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <CircleContext.Provider value={context}>
        <EmbedFormLayout>
          <Circle />
        </EmbedFormLayout>
      </CircleContext.Provider>
    </>
  );
};

export default EmbedCirclePage;
