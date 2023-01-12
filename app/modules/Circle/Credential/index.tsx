import { Box, useTheme } from "degen";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CredentialCenterHeading from "./CredentialCenterHeading";
import DistributedCredential from "./DistributedCredentials";

export default function Credential() {
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
      <Container marginX="8" paddingY="0">
        {credentialViewId === "Distributed" && <DistributedCredential />}
      </Container>
    </>
  );
}

const Container = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
        180deg,
        rgba(191, 90, 242, 0.4) 50%,
        rgba(191, 90, 242, 0.1) 100%
        )
        0% 0% / 100% 100% no-repeat padding-box;
    }
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(191, 90, 242, 0.8);
  }

  
`;
