import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Box, Heading, Input, Stack, Text } from "degen";
import { Hidden } from "react-grid-system";
import { useCircle } from "../../Circle/CircleContext";
import { useRouter } from "next/router";
import { ViewTab, ViewTabsContainer } from "../Payment/PaymentCenterHeading";
import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import Modal from "@/app/common/components/Modal";
import { useQuery as useApolloQuery, gql } from "@apollo/client";
import { Space } from "@/app/modules/Collection/VotingModule";
import { updateCircle } from "@/app/services/UpdateCircle";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";

type Props = {
  status: string;
  setStatus: (id: "Active" | "Completed") => void;
};

export default function GovernanceHeading({ status, setStatus }: Props) {
  const { navigationBreadcrumbs, circle } = useCircle();
  const router = useRouter();
  const { canDo } = useRoleGate();
  const { circle: cId } = router.query;
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [snapshotSpace, setSnapshotSpace] = useState("");

  const { loading: isLoading, data } = useApolloQuery(Space, {
    variables: { id: snapshotSpace },
  });

  const update = async () => {
    await updateCircle(
      {
        snapshot: {
          name: data?.space?.name || "",
          id: snapshotSpace,
          network: data?.space?.network || "",
          symbol: data?.space?.symbol || "",
        },
      },
      circle?.id as string
    );
  };

  return (
    <>
      <AnimatePresence>
        {snapshotModalOpen && (
          <Modal
            handleClose={() => {
              setSnapshotModalOpen(false);
              if (snapshotSpace && data?.space?.id) {
                update();
              }
            }}
            title="Integrate Snapshot"
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "90%",
                padding: "2rem",
              }}
            >
              <Text variant="label">Enter your snapshot url</Text>
              <Input
                label
                hideLabel
                prefix="https://snapshot.org/#/"
                value={snapshotSpace}
                placeholder="your-space.eth"
                onChange={(e) => {
                  setSnapshotSpace(e.target.value);
                }}
              />
              {snapshotSpace &&
                !isLoading &&
                (data?.space?.id ? (
                  <Text size={"extraSmall"} color="accent">
                    Snapshot Space - {data?.space?.name}
                  </Text>
                ) : (
                  <Text color={"red"}>Incorrect URL</Text>
                ))}
            </Box>
          </Modal>
        )}
      </AnimatePresence>
      <Box
        width="full"
        display="flex"
        flexDirection="column"
        paddingLeft="3"
        paddingRight="5"
      >
        <Hidden xs sm>
          <Box marginLeft="4" marginTop="2">
            {navigationBreadcrumbs && (
              <Breadcrumbs crumbs={navigationBreadcrumbs} />
            )}
          </Box>
        </Hidden>
        <Box paddingTop="2" display="flex" flexDirection="row" width="full">
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
              <Box
                width="full"
                paddingLeft={{
                  xs: "0",
                  md: "4",
                }}
              >
                <Heading>Governance Center</Heading>
              </Box>
            </Stack>
            {!circle?.snapshot?.id && (
              <PrimaryButton
                onClick={() => {
                  if (!canDo("manageCircleSettings")) {
                    toast.error(
                      "You don't have permission to connect Snapshot"
                    );
                    return;
                  }
                  setSnapshotModalOpen(true);
                }}
              >
                Connect Snapshot
              </PrimaryButton>
            )}
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
              key={"active"}
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
              key={"completed"}
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
}
