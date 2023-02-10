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
        title={"Circle"}
        description={"Circle Description"}
        image={"Circle Avatar"}
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
