import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import { NextPage } from "next";

import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const LinkDiscord: NextPage = () => {
  useConnectDiscord();

  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Loader loading text="Linking Discord" />
      </PublicLayout>
    </>
  );
};

export default LinkDiscord;
