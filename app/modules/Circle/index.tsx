import Loader from "@/app/common/components/Loader";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Registry } from "@/app/types";
import { Box, useTheme } from "degen";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import RetroPage from "../Retro";
import { useCircle } from "./CircleContext";
import Onboarding from "./CircleOnboarding";
import CircleOverview from "./CircleOverview";

const BoxContainer = styled(Box)`
  width: calc(100vw - 4rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 1rem);
  overflow-y: auto;
`;

export default function Circle() {
  const { circle, isLoading, memberDetails, page } = useCircle();
  const { canDo } = useRoleGate();
  const { onboarded } = useCircleOnboarding();

  const { mode } = useTheme();

  const { data: registry } = useQuery<Registry>(["registry", circle?.slug], {
    enabled: false,
  });

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  return (
    <BoxContainer paddingX="8" paddingTop="4">
      {!onboarded && canDo(["steward"]) && <Onboarding />}
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
      {page === "Overview" && <CircleOverview />}
      {page === "Retro" && <RetroPage />}
    </BoxContainer>
  );
}
