import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Text, Stack } from "degen";
import { useRouter } from "next/router";
import { Hidden } from "react-grid-system";
import { BiBot } from "react-icons/bi";
import { useCircle } from "../CircleContext";

const AutomationHeading = () => {
  const { navigationBreadcrumbs } = useCircle();
  const router = useRouter();
  return (
    <Box width="full" display="flex" flexDirection="column">
      <Hidden xs sm>
        <Box>
          {navigationBreadcrumbs && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Breadcrumbs crumbs={navigationBreadcrumbs as any} />
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
          </Stack>
          <Box display="flex" flexDirection="column" justifyContent="flex-end">
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: {
                    circle: router.query.circle,
                    tab: "automation",
                    newAuto: true,
                  },
                });
              }}
              icon={<BiBot size="20" />}
            >
              Add Automation
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AutomationHeading;
