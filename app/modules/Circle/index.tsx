import Loader from "@/app/common/components/Loader";
import { ApartmentOutlined } from "@ant-design/icons";
import { Box, Button, useTheme, Text, IconLockClosed, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Navigation from "../Project/Navigation";
import RetroPage from "../Retro";
import { useCircle } from "./CircleContext";
import CircleOverview from "./CircleOverview";
import { useRouter } from "next/router";
import { joinCircle } from "@/app/services/JoinCircle";
import Roles from "./RolesTab";

const BoxContainer = styled(Box)`
  width: calc(100vw - 3.5rem);
`;

export default function Circle() {
  const {
    circle,
    isLoading,
    memberDetails,
    page,
    fetchCircle,
    fetchMemberDetails,
  } = useCircle();
  const { mode } = useTheme();
  const [graphOpen, setGraphOpen] = useState(false);
  const router = useRouter();

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  if (circle?.unauthorized && !isLoading && circle?.id)
    return (
      <Box marginX="6">
        <Box
          style={{
            margin: "1rem auto",
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
                const data = await joinCircle(circle.id);
                if (data) {
                  fetchCircle();
                  fetchMemberDetails();
                }
              }}
            >
              <Text size="base" color={"accent"}>
                Get Role
              </Text>
            </Button>
          </Stack>
        </Box>
        <Roles />
      </Box>
    );

  return (
    <BoxContainer
      paddingX={{
        xs: "2",
        md: "8",
      }}
      paddingTop="4"
      id="box-container"
    >
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
          size="small"
        >
          <ApartmentOutlined
            style={{
              fontSize: "1.3rem",
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
