import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { UserType } from "@/app/types";
import { Box, Heading, Stack, useTheme } from "degen";
import { useRouter } from "next/router";
import { memo } from "react";
import { Hidden } from "react-grid-system";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function PaymentCenterHeading() {
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
      <Box paddingTop="2">
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
          justify="space-between"
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
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(PaymentCenterHeading);
