import Drawer from "@/app/common/components/Drawer";
import { Action, Condition, Trigger } from "@/app/types";
import { Box, Button, IconChevronRight, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import SingleAutomation from "./SingleAutomation";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  height: calc(100vh - 4rem);
`;

const AutomationDrawer = () => {
  const router = useRouter();
  const { autoId, cId, newAuto } = router.query;
  const { circle } = useCircle();
  const [isOpen, setIsOpen] = useState(false);

  const [automationMode, setAutomationMode] = useState("create");

  const [automationOrder, setAutomationOrder] = useState(
    (circle?.automationsIndexedByCollection &&
      circle?.automationsIndexedByCollection[cId as string]) ||
      []
  );
  const [automationId, setAutomationId] = useState(autoId as string);

  const handleClose = () => {
    setIsOpen(false);
    router.push({
      pathname: router.pathname,
      query: {
        circle: router.query.circle,
        tab: "automation",
      },
    });
  };

  useEffect(() => {
    if (circle) {
      if (newAuto === "true") {
        setAutomationMode("create");
        setAutomationId(`automation-${circle.automationCount + 1}`);

        setAutomationOrder([
          ...(automationOrder || []),
          `automation-${circle.automationCount + 1}`,
        ]);
      } else if (autoId) {
        setAutomationMode("edit");
        setAutomationId(autoId as string);

        setAutomationOrder(
          circle?.automationsIndexedByCollection &&
            circle?.automationsIndexedByCollection[cId as string]
        );
      }

      if (newAuto || autoId) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [circle, newAuto, router.query]);

  if (!circle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer
          width="50%"
          handleClose={() => {
            handleClose();
          }}
          header={
            <Box marginLeft="-4">
              <Stack
                direction="horizontal"
                align="center"
                justify="space-between"
              >
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <Stack direction="horizontal" align="center" space="0">
                    <IconChevronRight />
                    <Box marginLeft="-4">
                      <IconChevronRight />
                    </Box>
                  </Stack>
                </Button>
              </Stack>
            </Box>
          }
        >
          <Container paddingX="8" paddingY="4" overflow="auto">
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              justifyContent="flex-start"
            >
              <SingleAutomation
                automation={
                  automationMode === "create"
                    ? {
                        id: `automation-${circle.automationCount + 1}`,
                        name: `Automation ${circle.automationCount + 1}`,
                        description: "",
                        trigger: {} as Trigger,
                        actions: [] as Action[],
                        conditions: [] as Condition[],
                        triggerCategory: "collection",
                        triggerCollectionSlug: cId as string,
                      }
                    : circle.automations[automationId]
                }
                automationMode={automationMode}
                handleClose={handleClose}
              />
            </Box>
          </Container>
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default AutomationDrawer;
