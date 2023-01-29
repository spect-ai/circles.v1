import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Box, Heading, Stack, Text } from "degen";
import { Hidden } from "react-grid-system";
import { useCircle } from "../../Circle/CircleContext";
import { useRouter } from "next/router";
import { ViewTab, ViewTabsContainer } from "../Payment/PaymentCenterHeading";
import Link from "next/link";
import { useState } from "react";

type Props = {
  status: string;
  setStatus: (id: "Active" | "Completed") => void;
};

export default function GovernanceHeading({ status, setStatus }: Props) {
  const { navigationBreadcrumbs } = useCircle();
  const router = useRouter();
  const { circle: cId, proposalStatus } = router.query;

  return (
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
  );
}
