import Loader from "@/app/common/components/Loader";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { ApartmentOutlined } from "@ant-design/icons";
import { Box, Button, useTheme, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Navigation from "../Project/Navigation";
import RetroPage from "../Retro";
import { useCircle } from "./CircleContext";
import Onboarding from "./CircleOnboarding";
import CircleOverview from "./CircleOverview";
import { useRouter } from "next/router";
import { useGlobal } from "@/app/context/globalContext";

const BoxContainer = styled(Box)`
  width: calc(100vw - 4rem);
`;

export default function Circle() {
  const { circle, isLoading, memberDetails, page } = useCircle();
  const { connectedUser } = useGlobal();
  const { canDo } = useRoleGate();
  const { onboarded } = useCircleOnboarding();
  const { mode } = useTheme();
  const [graphOpen, setGraphOpen] = useState(false);
  const router = useRouter();

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  if (!circle.members.includes(connectedUser) && circle?.private)
    return (
      <BoxContainer padding={"16"}>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This circle is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </BoxContainer>
    );

  return (
    <BoxContainer paddingX="8" paddingTop="4">
      {!onboarded && canDo("createNewCircle") && <Onboarding />}
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
      <Box
        style={{
          position: "absolute",
          right: "2rem",
          bottom: "1rem",
          zIndex: "2",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setGraphOpen(true)}
          shape="circle"
        >
          <ApartmentOutlined
            style={{
              fontSize: "1.5rem",
            }}
          />
        </Button>
      </Box>
      <AnimatePresence>
        {graphOpen && <Navigation handleClose={() => setGraphOpen(false)} />}
      </AnimatePresence>
    </BoxContainer>
  );
}
