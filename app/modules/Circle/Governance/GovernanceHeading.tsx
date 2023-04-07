import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Box, Stack, Text } from "degen";
import { Hidden } from "react-grid-system";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";
import { ViewTab, ViewTabsContainer } from "../Payment/PaymentCenterHeading";
import { useCircle } from "../CircleContext";
import IntegrateSnapshotModal from "./IntegrateSnapshotModal";

type Props = {
  status: string;
  setStatus: (id: "Active" | "Completed") => void;
};

const GovernanceHeading = ({ status, setStatus }: Props) => {
  const { navigationBreadcrumbs, circle } = useCircle();
  const router = useRouter();
  const { canDo } = useRoleGate();
  const { circle: cId } = router.query;
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {snapshotModalOpen && (
          <IntegrateSnapshotModal
            handleClose={() => setSnapshotModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <Box width="full" display="flex" flexDirection="column">
        <Hidden xs sm>
          <Box>
            {navigationBreadcrumbs && (
              <Breadcrumbs crumbs={navigationBreadcrumbs} />
            )}
          </Box>
        </Hidden>
        <Box display="flex" flexDirection="row" width="full">
          <Box
            display="flex"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            width="full"
          >
            <Stack direction="horizontal" align="center">
              <Box width="full">
                <Text size="headingThree" weight="semiBold" ellipsis>
                  Governance Center
                </Text>
              </Box>
            </Stack>
            <PrimaryButton
              onClick={() => {
                if (!canDo("manageCircleSettings")) {
                  toast.error("You don't have permission to connect Snapshot");
                  return;
                }
                setSnapshotModalOpen(true);
              }}
              variant={circle?.snapshot?.id ? "tertiary" : "secondary"}
            >
              {circle?.snapshot?.id
                ? "Update Snapshot Connection"
                : "Connect Snapshot"}
            </PrimaryButton>
          </Box>
        </Box>
        <ViewTabsContainer
          backgroundColor="background"
          paddingX="4"
          borderTopRadius="large"
          display="flex"
          flexDirection="row"
        >
          <Link href={`/${cId}?tab=governance&proposalStatus=Active`}>
            <ViewTab
              paddingX="4"
              backgroundColor={
                status === "Active" ? "backgroundSecondary" : "background"
              }
              borderTopWidth={status === "Active" ? "0.375" : "0"}
              borderRightWidth={status === "Active" ? "0.375" : "0"}
              borderLeftWidth={status === "Active" ? "0.375" : "0"}
              key="active"
              onClick={() => setStatus("Active")}
            >
              <Text variant="small" weight="semiBold">
                Active
              </Text>
            </ViewTab>
          </Link>
          <Link href={`/${cId}?tab=governance&proposalStatus=Completed`}>
            <ViewTab
              paddingX="4"
              backgroundColor={
                status === "Completed" ? "backgroundSecondary" : "background"
              }
              borderTopWidth={status === "Completed" ? "0.375" : "0"}
              borderRightWidth={status === "Completed" ? "0.375" : "0"}
              borderLeftWidth={status === "Completed" ? "0.375" : "0"}
              key="completed"
              onClick={() => setStatus("Completed")}
            >
              <Text variant="small" weight="semiBold">
                Completed
              </Text>
            </ViewTab>
          </Link>
        </ViewTabsContainer>
      </Box>
    </>
  );
};

export default GovernanceHeading;
