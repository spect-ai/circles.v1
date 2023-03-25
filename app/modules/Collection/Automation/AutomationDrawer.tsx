import Drawer from "@/app/common/components/Drawer";
import {
  addAutomation,
  removeAutomation,
  updateAutomation,
} from "@/app/services/UpdateCircle";
import { Action, Condition, Trigger } from "@/app/types";
import { Box, Button, IconChevronRight, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import SingleAutomation from "./SingleAutomation";

export default function AutomationDrawer({}) {
  const router = useRouter();
  const { autoId, cId, newAuto } = router.query;
  const { circle, setCircleData, fetchCircle } = useCircle();
  if (!circle) return null;
  const [isOpen, setIsOpen] = useState(false);

  const [automationMode, setAutomationMode] = useState("create");

  const [automationOrder, setAutomationOrder] = useState(
    (circle?.automationsIndexedByCollection &&
      circle?.automationsIndexedByCollection[cId as string]) ||
      []
  );
  const [automationId, setAutomationId] = useState(autoId as string);

  const onSave = async (
    name: string,
    description: string,
    trigger: Trigger,
    actions: Action[],
    conditions: Condition[],
    slug: string
  ) => {
    if (!circle) return;
    console.log(name, description, trigger, actions, conditions, slug);
    const newAutomation = {
      name,
      description,
      trigger,
      actions,
      conditions,
    };
    let res;
    if (automationMode === "create") {
      res = await addAutomation(circle?.id, {
        ...newAutomation,
        triggerCategory: "collection",
        triggerCollectionSlug: slug,
      });
    } else {
      res = await updateAutomation(circle?.id, automationId, newAutomation);
    }
    if (res) {
      void fetchCircle();
    }
    setAutomationMode("edit");
  };

  const handleClose = () => {
    router.push({
      pathname: router.pathname,
      query: {
        circle: router.query.circle,
        tab: "automation",
      },
    });
  };

  useEffect(() => {
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
  }, [router.query]);

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
                      }
                    : circle.automations[automationId]
                }
                automationMode={automationMode}
                onDelete={async () => {
                  const res = await removeAutomation(automationId, circle.id);
                  if (res) {
                    void fetchCircle();
                  }

                  router.push({
                    pathname: router.pathname,
                    query: {
                      circle: router.query.circle,
                      tab: "automation",
                    },
                  });
                }}
                onSave={onSave}
                handleClose={handleClose}
                onDisable={async () => {
                  const res = await updateAutomation(circle?.id, automationId, {
                    ...circle.automations[automationId],
                    disabled: !circle.automations[automationId].disabled,
                  });
                  if (res) setCircleData(res);
                }}
              />
            </Box>
          </Container>
        </Drawer>
      )}
    </AnimatePresence>
  );
}

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  height: calc(100vh - 4rem);
`;
