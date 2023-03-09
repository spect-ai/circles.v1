import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { smartTrim } from "@/app/common/utils/utils";
import {
  addAutomation,
  removeAutomation,
  updateAutomation,
} from "@/app/services/UpdateCircle";
import {
  Action,
  Automation as SingleAutomationType,
  AutomationType,
  CollectionType,
  Condition,
  Trigger,
} from "@/app/types";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Button, IconPencil, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import SingleAutomation from "./SingleAutomation";

export default function Automation({
  collection,
}: {
  collection: CollectionType;
}) {
  const { circle, setCircleData } = useCircle();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const onTabClick = (id: number) => {
    if (automationOrder[id] in automationInCreate) setAutomationMode("create");
    else setAutomationMode("edit");
    setAutomationId(automationOrder[id]);
    setTab(id);
  };
  const [tabs, setTabs] = useState([
    `𝘕𝘦𝘸: Automation ${circle?.automationCount || 0 + 1}`,
  ] as string[]);
  const [automationMode, setAutomationMode] = useState("create");
  const [automations, setAutomations] = useState(circle?.automations || {});
  const [automationOrder, setAutomationOrder] = useState(
    (circle?.automationsIndexedByCollection &&
      circle?.automationsIndexedByCollection[collection.slug as string]) ||
      []
  );
  const [automationId, setAutomationId] = useState(automationOrder[tab]);
  const [automationInCreate, setAutomationInCreate] = useState(
    {} as AutomationType
  );
  const [automationInEdit, setAutomationInEdit] = useState(
    {} as AutomationType
  );

  const saveDraftLocal = (
    automation: SingleAutomationType,
    isDirty: boolean
  ) => {
    if (automationMode === "create") {
      console.log("autoInCreate");
      setAutomationInCreate({
        [automationId]: automation,
      });
    }
  };
  const init = (initTab?: number) => {
    if (!circle) return;
    setAutomationOrder(
      circle.automationsIndexedByCollection[collection.slug as string]
    );
    setAutomations(circle.automations);
    if (initTab || initTab === 0) {
      setAutomationId(
        circle.automationsIndexedByCollection[collection.slug as string][
          initTab
        ]
      );
      setTab(initTab);
    } else
      setAutomationId(
        circle.automationsIndexedByCollection[collection.slug as string][tab]
      );
    const tabs = circle.automationsIndexedByCollection[
      collection.slug as string
    ].map((automationId) => {
      return circle.automations[automationId].name;
    });

    setTabs(tabs);
    setAutomationMode("edit");
  };

  const initNew = () => {
    setTabs(["𝘕𝘦𝘸: Automation 1"]);
    setAutomationOrder(["automation-1"]);
    setAutomationId("automation-1");
    setAutomations({
      "automation-1": {
        id: "automation-1",
        name: "Automation 1",
        description: "",
        trigger: {} as Trigger,
        actions: [] as Action[],
        conditions: [] as Condition[],
        triggerCategory: "collection",
        triggerCollectionSlug: "",
      },
    });
    setAutomationMode("create");
    setTab(0);
    setAutomationInCreate({
      "automation-1": {
        id: "automation-1",
        name: "Automation 1",
        description: "",
        trigger: {} as Trigger,
        actions: [] as Action[],
        conditions: [] as Condition[],
        triggerCategory: "collection",
        triggerCollectionSlug: "",
      },
    });
  };

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
    if (automationMode === "create") {
      const res = await addAutomation(circle?.id, {
        ...newAutomation,
        triggerCategory: "collection",
        triggerCollectionSlug: slug,
      });
      if (res) setCircleData(res);
    } else {
      const res = await updateAutomation(
        circle?.id,
        automationId,
        newAutomation
      );
      if (res) setCircleData(res);
    }
    setAutomationMode("edit");
    if (automationId in automationInCreate) {
      setAutomationInCreate({});
    } else if (automationId in automationInEdit) {
      delete automationInEdit[automationId];
    }
  };

  useEffect(() => {
    if (!isOpen || !circle) return;
    if (
      !circle.automationsIndexedByCollection ||
      !collection.slug ||
      !circle.automationsIndexedByCollection[collection.slug as string]?.length
    ) {
      initNew();
    } else {
      init();
    }
  }, [circle?.automationsIndexedByCollection, circle?.automations]);

  useEffect(() => {
    setAutomationInCreate({});
    setAutomationMode("edit");

    if (
      !circle?.automationsIndexedByCollection ||
      !collection.slug ||
      !circle.automationsIndexedByCollection[collection.slug as string]?.length
    ) {
      initNew();
    } else {
      init(0);
    }
  }, [isOpen]);

  if (!circle) return null;

  return (
    <Box marginY="2">
      <Stack direction="horizontal" space="3" align={"center"}>
        {(automationOrder?.length > 1 ||
          !automationId?.startsWith("automation")) && (
          <Text variant="extraLarge" weight="semiBold" color={"accent"}>
            {collection.name}
          </Text>
        )}
        <Button
          shape={
            automationOrder?.length > 1 ||
            !automationId?.startsWith("automation")
              ? "circle"
              : undefined
          }
          size="small"
          variant={
            automationOrder?.length > 1 ||
            !automationId?.startsWith("automation")
              ? "transparent"
              : "secondary"
          }
          onClick={() => setIsOpen(true)}
          prefix={<GatewayOutlined />}
        >
          {automationOrder?.length > 1 ||
          !automationId?.startsWith("automation") ? (
            <IconPencil size={"5"} color="accent" />
          ) : (
            `Add Automations`
          )}
        </Button>
      </Stack>

      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Automation"
            size="large"
            handleClose={() => setIsOpen(false)}
            height="90vh"
          >
            <Box
              display="flex"
              flexDirection={{
                xs: "column",
                md: "row",
              }}
              width={{
                xs: "full",
              }}
            >
              {collection?.id && (
                <Box
                  width={{
                    xs: "full",
                    md: "1/4",
                  }}
                  paddingY="8"
                  paddingRight={{
                    xs: "1",
                    md: "1",
                  }}
                >
                  <Tabs
                    selectedTab={tab}
                    onTabClick={onTabClick}
                    tabs={tabs}
                    tabTourIds={[]}
                    orientation="vertical"
                    unselectedColor="transparent"
                  />
                </Box>
              )}
              <Box
                display="flex"
                flexDirection="column"
                width={{
                  xs: "full",
                  md: !collection.id ? "full" : "3/4",
                }}
                paddingRight="8"
                paddingLeft={collection.id ? "2" : "8"}
                justifyContent="flex-start"
              >
                <SingleAutomation
                  col={collection}
                  automation={
                    automationMode === "create"
                      ? automationInCreate[automationId] ||
                        automations[automationId]
                      : automationInEdit[automationId] ||
                        automations[automationId]
                  }
                  automationMode={automationMode}
                  onDelete={async () => {
                    const res = await removeAutomation(automationId, circle.id);
                    if (res) {
                      if (
                        tab >=
                        res.automationsIndexedByCollection[
                          collection.slug as string
                        ].length
                      )
                        setTab(tab - 1);
                      setCircleData(res);
                    }
                  }}
                  onSave={onSave}
                  handleClose={() => setIsOpen(false)}
                  onDisable={async () => {
                    const res = await updateAutomation(
                      circle?.id,
                      automationId,
                      {
                        ...automations[automationId],
                        disabled: !automations[automationId].disabled,
                      }
                    );
                    if (res) setCircleData(res);
                  }}
                  onMouseLeave={(
                    name: string,
                    description: string,
                    trigger: Trigger,
                    actions: Action[],
                    conditions: Condition[],
                    isDirty: boolean
                  ) => {
                    saveDraftLocal(
                      {
                        id: automationId,
                        name,
                        description,
                        trigger,
                        actions,
                        conditions,
                        triggerCategory: "collection",
                      },
                      isDirty
                    );
                  }}
                />
              </Box>
            </Box>
            {collection?.id && (
              <Box
                width={{
                  xs: "full",
                  md: "1/4",
                }}
                paddingBottom="4"
                padding={{
                  xs: "1",
                  md: "1",
                }}
                marginLeft="1"
              >
                <PrimaryButton
                  variant="secondary"
                  disabled={Object.keys(automationInCreate).length > 0}
                  onClick={() => {
                    setTabs([
                      ...tabs,
                      `𝘕𝘦𝘸: Automation ${circle.automationCount + 1}`,
                    ]);
                    setAutomationOrder([
                      ...automationOrder,
                      `automation-${circle.automationCount + 1}`,
                    ]);
                    setAutomationId(`automation-${circle.automationCount + 1}`);

                    setAutomations({
                      ...automations,
                      [`automation-${circle.automationCount + 1}`]: {
                        id: `automation-${circle.automationCount + 1}`,
                        name: `Automation ${circle.automationCount + 1}`,
                        description: "",
                        trigger: {} as Trigger,
                        actions: [] as Action[],
                        conditions: [] as Condition[],
                        triggerCategory: "collection",
                      },
                    });
                    setAutomationMode("create");
                    setTab(tabs.length);
                    setAutomationInCreate({
                      [`automation-${circle.automationCount + 1}`]: {
                        id: `automation-${circle.automationCount + 1}`,
                        name: `Automation ${circle.automationCount + 1}`,
                        description: "",
                        trigger: {} as Trigger,
                        actions: [] as Action[],
                        conditions: [] as Condition[],
                        triggerCategory: "collection",
                      },
                    });
                  }}
                >
                  + New Automation
                </PrimaryButton>
              </Box>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}
