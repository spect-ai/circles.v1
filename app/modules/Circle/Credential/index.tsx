import { useTheme } from "degen";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import CredentialCenterHeading from "./CredentialCenterHeading";

const Credential = () => {
  const [credentialViewId, setCredentialViewId] =
    useState<"Distributed">("Distributed");

  const { mode } = useTheme();

  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <CredentialCenterHeading
        credentialViewId={credentialViewId}
        setCredentialViewId={setCredentialViewId}
      />
    </>
  );
};

export default Credential;
