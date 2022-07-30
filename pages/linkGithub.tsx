import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import useConnectGithub from "@/app/services/Github/useConnectGithub";
import { NextPage } from "next";

import MetaHead from "../app/common/seo/MetaHead/MetaHead";

const LinkGithub: NextPage = () => {
  useConnectGithub();
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Loader loading text="Linking Github" />
      </PublicLayout>
    </>
  );
};

export default LinkGithub;
