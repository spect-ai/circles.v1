import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Box, Heading, Stack } from "degen";
import { Hidden } from "react-grid-system";
import { useCircle } from "../../Circle/CircleContext";
import Automation from "../../Collection/Automation";

export const AutomationHeading = () => {
  const { navigationBreadcrumbs } = useCircle();
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
              <Heading>Automation Center</Heading>
            </Box>
          </Stack>
          <Automation collection={{} as any} />
        </Box>
      </Box>
    </Box>
  );
};
