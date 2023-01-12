import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { UserType } from "@/app/types";
import { Box, Heading, Stack, useTheme, Text } from "degen";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { Hidden } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import ConnectGnosis from "../CircleSettingsModal/ConnectGnosis";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

type Props = {
  paymentViewId: string;
  setPaymentViewId: (id: "Pending" | "Completed" | "Cancelled") => void;
};

function PaymentCenterHeading({ paymentViewId, setPaymentViewId }: Props) {
  const { mode } = useTheme();
  const router = useRouter();
  const { navigationBreadcrumbs } = useCircle();
  const { circle: cId } = router.query;
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

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
              <Heading>Payment Center</Heading>
            </Box>
          </Stack>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
          <ConnectGnosis />
        </Box>
      </Box>
      <ViewTabsContainer
        backgroundColor="background"
        paddingX="4"
        borderTopRadius="large"
        display="flex"
        flexDirection="row"
      >
        <Link href={`/${cId}?tab=payment&status=pending`}>
          <ViewTab
            paddingX="4"
            backgroundColor={
              paymentViewId === "Pending" ? "backgroundSecondary" : "background"
            }
            borderTopWidth={paymentViewId === "Pending" ? "0.375" : "0"}
            borderRightWidth={paymentViewId === "Pending" ? "0.375" : "0"}
            borderLeftWidth={paymentViewId === "Pending" ? "0.375" : "0"}
            key={"pending"}
            onClick={() => setPaymentViewId("Pending")}
          >
            <Text variant="small" weight="semiBold">
              Pending
            </Text>
          </ViewTab>
        </Link>
        <Link href={`/${cId}?tab=payment&status=completed`}>
          <ViewTab
            paddingX="4"
            backgroundColor={
              paymentViewId === "Completed"
                ? "backgroundSecondary"
                : "background"
            }
            borderTopWidth={paymentViewId === "Completed" ? "0.375" : "0"}
            borderRightWidth={paymentViewId === "Completed" ? "0.375" : "0"}
            borderLeftWidth={paymentViewId === "Completed" ? "0.375" : "0"}
            key={"completed"}
            onClick={() => setPaymentViewId("Completed")}
          >
            <Text variant="small" weight="semiBold">
              Completed
            </Text>
          </ViewTab>
        </Link>
        <Link href={`/${cId}?tab=payment&status=cancelled`}>
          <ViewTab
            paddingX="4"
            backgroundColor={
              paymentViewId === "Cancelled"
                ? "backgroundSecondary"
                : "background"
            }
            borderTopWidth={paymentViewId === "Cancelled" ? "0.375" : "0"}
            borderRightWidth={paymentViewId === "Cancelled" ? "0.375" : "0"}
            borderLeftWidth={paymentViewId === "Cancelled" ? "0.375" : "0"}
            key={"cancelled"}
            onClick={() => setPaymentViewId("Cancelled")}
          >
            <Text variant="small" weight="semiBold">
              Cancelled
            </Text>
          </ViewTab>
        </Link>
      </ViewTabsContainer>
    </Box>
  );
}

export default memo(PaymentCenterHeading);

export const ViewTabsContainer = styled(Box)`
  margin-top: 16px;
`;

export const ViewTab = styled(Box)`
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;
