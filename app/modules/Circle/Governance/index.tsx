import { Box, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import GovernanceHeading from "./GovernanceHeading";

export default function Governance() {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId, proposalStatus } = router.query;
  const [status, setStatus] = useState(proposalStatus);
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
      <GovernanceHeading status={status as string} setStatus={setStatus} />
    </>
  );
}
