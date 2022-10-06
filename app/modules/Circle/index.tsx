import Loader from "@/app/common/components/Loader";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { ApartmentOutlined } from "@ant-design/icons";
import { Box, Button, useTheme, Text, IconLockClosed, Stack } from "degen";
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
import { joinCircle } from "@/app/services/JoinCircle";

const BoxContainer = styled(Box)`
  width: calc(100vw - 4rem);
`;

export default function Circle() {
  const {
    circle,
    isLoading,
    memberDetails,
    page,
    fetchCircle,
    fetchMemberDetails,
    loading,
    setLoading,
  } = useCircle();

  const { canDo } = useRoleGate();
  const { onboarded } = useCircleOnboarding();
  const { mode } = useTheme();
  const [graphOpen, setGraphOpen] = useState(false);
  const router = useRouter();

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  if (circle?.unauthorized && !isLoading && circle?.id)
    return (
      <Box
        style={{
          margin: "20% 35%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Button shape="circle" variant="secondary" size="large">
          <IconLockClosed color={"accent"} size="6" />
        </Button>

        <Text size="headingTwo" weight="semiBold" ellipsis>
          This circle is private
        </Text>
        <Stack direction="horizontal" space="4" align="center">
          <Button
            size="small"
            variant="transparent"
            onClick={() => router.back()}
          >
            <Text size="base">Go Back</Text>
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={async () => {
              setLoading(true);
              const data = await joinCircle(circle.id);
              if (data) {
                fetchCircle();
                fetchMemberDetails();
              }
              setLoading(false);
            }}
            loading={loading}
          >
            <Text size="base" color={"accent"}>
              Get Role
            </Text>
          </Button>
        </Stack>
      </Box>
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
