import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import { NextPage } from "next";

const LinkDiscord: NextPage = () => {
  useConnectDiscord();

  return (
    <PublicLayout>
      <Loader loading text="Linking Discord" />
    </PublicLayout>
  );
};

export default LinkDiscord;
