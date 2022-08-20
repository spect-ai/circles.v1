import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import useConnectGithub from "@/app/services/Github/useConnectGithub";
import { NextPage } from "next";

const LinkGithub: NextPage = () => {
  useConnectGithub();
  return (
    <PublicLayout>
      <Loader loading text="Linking Github" />
    </PublicLayout>
  );
};

export default LinkGithub;
