import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Text, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import { Hidden } from "react-grid-system";
import { BiBot } from "react-icons/bi";
import { useCircle } from "../../Circle/CircleContext";

export const AutomationHeading = () => {
  const { navigationBreadcrumbs } = useCircle();
  const router = useRouter();
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
          gap={{
            xs: "4",
            md: "0",
          }}
        >
          <Text size="headingThree" weight="semiBold" ellipsis>
            Automation Center
          </Text>
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
