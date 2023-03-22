import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Box, Text, Heading, Stack } from "degen";
import { Hidden } from "react-grid-system";
import { useCircle } from "../../Circle/CircleContext";
import Automation from "../../Collection/Automation";

export const AutomationHeading = () => {
  const { navigationBreadcrumbs } = useCircle();
  return (
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
                Automation Center
              </Text>
            </Box>
          </Stack>{" "}
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <Automation collection={{} as any} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
