import Loader from "@/app/common/components/Loader";
import { PublicLayout } from "@/app/common/layout";
import { NextPage } from "next";
import { useEffect } from "react";
import { useLocation } from "react-use";

export const AuthCallback: NextPage = () => {
  const location = useLocation();
  useEffect(() => {
    var locationHash = "",
      re = /[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/,
      match;
    try {
      locationHash = location.hash?.toString() || "";
      console.log({ locationHash, match: locationHash.match(re) });
      if ((match = locationHash.match(re))) {
        location.hash = locationHash.replace(re, "");
        var data = match[1] || "";
        data = data.replace(/-/g, "+").replace(/_/g, "/");
        var pad = data.length % 4;
        if (pad > 1) {
          data += new Array(5 - pad).join("=");
        }
        const userData = JSON.parse(window.atob(data));
        console.log("got data");
        if (window.opener) {
          console.log({ userData });
          window.opener.postMessage({ userData }, "*");
          window.close();
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [location]);

  return (
    <PublicLayout>
      <Loader loading text="Fetching your data" />
    </PublicLayout>
  );
};
