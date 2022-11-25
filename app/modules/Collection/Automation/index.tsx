import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import {
  addAutomation,
  updateAutomation,
  updateCircle,
} from "@/app/services/UpdateCircle";
import { Action, AutomationType, Trigger } from "@/app/types";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAutomation from "./SingleAutomation";

export default function Automation() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const onTabClick = (id: number) => {
    setAutomationId(automationOrder[id]);
    setTab(id);
  };
  const [tabs, setTabs] = useState([] as string[]);
  const [automationId, setAutomationId] = useState("");
  const [automations, setAutomations] = useState({} as AutomationType);
  const [automationOrder, setAutomationOrder] = useState({} as string[]);

  const { circle, setCircleData } = useCircle();
  const { mode } = useTheme();

  const onSave = async (automation: any, automationId?: string) => {
    if (automationId) {
      const res = await updateAutomation(automationId, automation, circle?.id);
      if (res) {
        setCircleData(res);
      }
    } else {
      const res = await addAutomation(automation, circle?.id);
    }
  };

  useEffect(() => {
    console.log(circle?.automationCount);
    if (!circle?.automationCount) {
      console.log("kekek");
      setTabs(["Automation 1"]);
      setAutomationOrder(["automation-1"]);
      setAutomationId("automation-1");
      setAutomations({
        "automation-1": {
          id: "automation-1",
          name: "Automation 1",
          description: "",
          trigger: {} as Trigger,
          actions: [] as Action[],
          triggerCategory: "collection",
        },
      });
    }
  }, []);

  console.log({ automations, automationOrder, automationId, tabs });

  return (
    <>
      <Stack direction="vertical">
        <Text variant="small">{`Reduce recurring chores`}</Text>
      </Stack>
      <Box
        width={{
          xs: "full",
          md: "full",
        }}
      >
        <PrimaryButton
          variant={automationOrder?.length > 1 ? "tertiary" : "secondary"}
          onClick={() => setIsOpen(true)}
          icon={<GatewayOutlined />}
        >
          {automationOrder?.length > 1 ? `Edit Automations` : `Add Automations`}
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Automation"
            size="large"
            handleClose={() => setIsOpen(false)}
          >
            <Box
              paddingLeft={{
                xs: "4",
                md: "8",
              }}
            >
              <Breadcrumbs
                crumbs={[
                  {
                    name: "Automations",
                    href: "/automations",
                  },
                  {
                    name: "Create",
                    href: "/automations/create",
                  },
                ]}
              />
            </Box>

            <Box display="flex">
              <Box width="1/4" paddingY="8" paddingRight="1">
                <Tabs
                  selectedTab={tab}
                  onTabClick={onTabClick}
                  tabs={tabs}
                  tabTourIds={[]}
                  orientation="vertical"
                  unselectedColor="transparent"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                width="3/4"
                paddingRight="8"
                paddingLeft="2"
                justifyContent="flex-start"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  marginTop="8"
                  width="full"
                  gap="2"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="1"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    style={{ width: "80%" }}
                  >
                    <NameInput
                      placeholder="Enter name"
                      autoFocus
                      value={automations[automationId].name}
                      onChange={(e) => {
                        setAutomations({
                          ...automations,
                          [automationId]: {
                            ...automations[automationId],
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <DescriptionInput
                      placeholder="Enter Description"
                      mode={mode}
                      autoFocus
                      value={automations[automationId].description}
                      onChange={(e) => {
                        setAutomations({
                          ...automations,
                          [automationId]: {
                            ...automations[automationId],
                            description: e.target.value,
                          },
                        });
                      }}
                    />
                  </Box>
                  <PrimaryButton
                    variant="secondary"
                    onClick={() =>
                      onSave(automations[automationId], automationId)
                    }
                  >
                    Save
                  </PrimaryButton>
                  <PrimaryButton
                    variant="tertiary"
                    onClick={() => onSave(automations[automationId])}
                  >
                    Delete
                  </PrimaryButton>
                </Box>

                <ScrollContainer
                  width="full"
                  paddingX={{
                    xs: "2",
                    md: "4",
                    lg: "8",
                  }}
                  paddingY="4"
                >
                  <SingleAutomation automation={automations[automationId]} />
                </ScrollContainer>
              </Box>
            </Box>
            <Box width="1/4" paddingBottom="4" padding="1">
              <PrimaryButton variant="secondary" onClick={() => {}}>
                Add Automation
              </PrimaryButton>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  height: 35rem;
  overflow-y: auto;
`;

export const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

export const DescriptionInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
`;
