import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import { NextPage } from "next";

const AuthCallback: NextPage = () => (
  <PublicLayout>
    <Loader loading text="Fetching your data" />
  </PublicLayout>
);

export default AuthCallback;
