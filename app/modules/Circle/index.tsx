import Loader from "@/app/common/components/Loader";
import { Box, Button, useTheme, Text, IconLockClosed, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "./CircleContext";
import CircleDashboard from "./CircleOverview";
import { useRouter } from "next/router";
import { joinCircle } from "@/app/services/JoinCircle";
import Roles from "./RolesTab";
import FAQModal from "../Dashboard/FAQModal";
import Payment from "./Payment";
import Credential from "./Credential";
import AutomationCenter from "./Automation";
import Help from "@/app/common/components/Help";
import Governance from "./Governance";
import Membership from "./Membership";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";

const BoxContainer = styled(Box)`
  @media (max-width: 992px) {
    width: calc(100vw - 0rem);
  }
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
  const [faqOpen, setFaqOpen] = useState(false);
  const router = useRouter();
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  useEffect(() => {
    void fetchCircle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedUser]);

  if (isLoading || !circle || !memberDetails) {
    return <Loader text="...." loading />;
  }

  if (router.query?.tab === "payment") {
    return <Payment />;
  }

  if (router.query?.tab === "credential") {
    return <Credential />;
  }

  if (router.query?.tab === "automation") {
    return <AutomationCenter />;
  }

  if (router.query?.tab === "governance") {
    return <Governance />;
  }

  if (router.query.tab === "membership") {
    return <Membership />;
  }

  if (circle?.unauthorized && !isLoading && circle?.id)
    return (
      <Box marginX="6">
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
                  toast("You have joined space!", {
                    theme: "dark",
                  });
                  fetchCircle();
                  fetchMemberDetails();
                  return;
                }
                toast(
                  "Sorry, you dont meet the requirements to join this circle",
                  {
                    theme: "dark",
                  }
                );
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
      paddingTop="2"
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
      {page === "Overview" && <CircleDashboard />}
      <Help setFaqOpen={setFaqOpen} />
      <AnimatePresence>
        {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
      </AnimatePresence>
    </BoxContainer>
  );
}
