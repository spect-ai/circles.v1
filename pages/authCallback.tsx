import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import { NextPage } from "next";

const AuthCallback: NextPage = () => {
  return (
    <PublicLayout>
      <Loader loading text="Fetching your data" />
    </PublicLayout>
  );
};

export default AuthCallback;
