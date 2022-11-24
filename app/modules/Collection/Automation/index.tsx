import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import {
  addAutomation,
  updateAutomation,
  updateCircle,
} from "@/app/services/UpdateCircle";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAutomation from "./SingleAutomation";

export default function Automation() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const onTabClick = (id: number) => setTab(id);
  const [tabs, setTabs] = useState(["Status"]);
  const [automationOrder, setAutomationOrder] = useState(["1"]);
  const [automations, setAutomations] = useState({
    "1": {
      name: "Status Change Automation",
      description:
        "Automatically change the status of a card when a certain condition is met",
      trigger: {
        type: "field",
        fieldName: "status",
        fieldType: "singleSelect",
        triggerType: "changes",
        from: "open",
        to: "closed",
      },
      actions: [
        {
          id: "giveRole",
          type: "internal",
          service: "circle",
          do: "Give Role",
          data: {
            role: "steward",
          },
        },
        {
          id: "createCard",
          type: "internal",
          service: "project",
          do: "Create card",
          data: {
            projectSlug: "project-1",
            title: "New Card",
            description: "This is a new card",
          },
        },

        {
          id: "createDiscordChannel",
          type: "external",
          service: "discord",
          do: "Create Discord channel",
          data: {
            channelName: "test",
            channelDescription: "test",
            user: "responder",
          },
        },
        {
          id: "sendEmail",
          type: "external",
          service: "email",
          do: "Send email",
          data: {
            emailMessage: "test",
          },
        },
      ],
    },
  });

  const { circle, setCircleData } = useCircle();

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
          variant={automationOrder?.length > 0 ? "tertiary" : "secondary"}
          onClick={() => setIsOpen(true)}
          icon={<GatewayOutlined />}
        >
          {automationOrder?.length > 0 ? `Edit Automations` : `Add Automations`}
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Automation"
            size="large"
            handleClose={() => setIsOpen(false)}
          >
            <Box display="flex">
              <Box width="1/4" paddingY="8" paddingRight="1">
                <Tabs
                  selectedTab={tab}
                  onTabClick={onTabClick}
                  tabs={tabs}
                  tabTourIds={[
                    "profile-settings-basic",
                    "profile-settings-about",
                  ]}
                  orientation="vertical"
                  unselectedColor="transparent"
                />
              </Box>
              <ScrollContainer
                width="3/4"
                paddingX={{
                  xs: "2",
                  md: "4",
                  lg: "8",
                }}
                paddingY="4"
              >
                <SingleAutomation automation={automations["1"]} />
              </ScrollContainer>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 10px;
  }
  height: 35rem;
  overflow-y: auto;
`;
