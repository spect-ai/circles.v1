import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import { useGlobal } from "@/app/context/globalContext";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { RetroType } from "@/app/types";
import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Col, Container, Row } from "react-grid-system";
import { Tooltip } from "react-tippy";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import RetroPage from "../Retro";
import CreateRetro from "../Retro/CreateRetro";
import RetroModal from "../Retro/RetroModal";
import { useCircle } from "./CircleContext";
import CircleMembers from "./CircleMembers";
import Onboarding from "./CircleOnboarding";
import CircleOverview from "./CircleOverview";
import CreateProjectModal from "./CreateProjectModal";
import CreateSpaceModal from "./CreateSpaceModal";

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

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  return (
    <BoxContainer paddingX="8" paddingTop="4">
      {!onboarded && canDo(["steward"]) && <Onboarding />}
      <ToastContainer
        toastStyle={{
          backgroundColor: "rgb(20,20,20)",
          color: "rgb(255,255,255,0.7)",
        }}
      />
      {page === "Overview" && <CircleOverview />}
      {page === "Retro" && <RetroPage />}
    </BoxContainer>
  );
}
