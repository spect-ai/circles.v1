import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { UserType } from "@/app/types";
import { Box, Heading, Stack, useTheme, Text } from "degen";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { Hidden } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import ConnectGnosis from "../CircleSettingsModal/ConnectGnosis";
import CreateCredentials from "./CreateCredentials";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

type Props = {
  credentialViewId: string;
  setCredentialViewId: (id: "Distributed") => void;
};

function PaymentCenterHeading({
  credentialViewId,
  setCredentialViewId,
}: Props) {
  const { mode } = useTheme();
  const router = useRouter();
  const { navigationBreadcrumbs } = useCircle();

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
              <Heading>Credential Center</Heading>
            </Box>
          </Stack>
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <CreateCredentials />
          </Box>
        </Box>
      </Box>
      <ViewTabsContainer
        backgroundColor="background"
        paddingX="4"
        borderTopRadius="large"
        display="flex"
        flexDirection="row"
      >
        <ViewTab
          paddingX="4"
          backgroundColor={
            credentialViewId === "Distributed"
              ? "backgroundSecondary"
              : "background"
          }
          borderTopWidth={credentialViewId === "Distributed" ? "0.375" : "0"}
          borderRightWidth={credentialViewId === "Distributed" ? "0.375" : "0"}
          borderLeftWidth={credentialViewId === "Distributed" ? "0.375" : "0"}
          key={"Distributed"}
          onClick={() => setCredentialViewId("Distributed")}
        >
          <Text variant="small" weight="semiBold">
            Distributed
          </Text>
        </ViewTab>
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
