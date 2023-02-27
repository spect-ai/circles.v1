import CheckBox from "@/app/common/components/Table/Checkbox";
import { updateCircle } from "@/app/services/UpdateCircle";
import { SidebarConfig } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";

type Props = {};

const SidebarConfig = (props: Props) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  const [showGovernance, setShowGovernance] = useState(false);
  const [showMembership, setShowMembership] = useState(false);

  const { circle, setCircleData } = useCircle();

  useEffect(() => {
    setShowPayment(Boolean(circle?.sidebarConfig?.showPayment));
    setShowAutomation(Boolean(circle?.sidebarConfig?.showAutomation));
    setShowGovernance(Boolean(circle?.sidebarConfig?.showGovernance));
    setShowMembership(Boolean(circle?.sidebarConfig?.showMembership));
  }, []);

  const update = (sidebarConfig: SidebarConfig) => {
    updateCircle(
      {
        sidebarConfig,
      },
      circle.id
    )
      .then((res) => {
        if (res) {
          setCircleData(res);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box padding="8">
      <Stack>
        <Heading>Sidebar Config</Heading>
        <Stack direction="horizontal">
          <CheckBox
            isChecked={showPayment}
            onClick={() => {
              setShowPayment(!showPayment);
              update({ ...circle.sidebarConfig, showPayment: !showPayment });
            }}
          />
          <Text>Show Payment Center</Text>
        </Stack>
        <Stack direction="horizontal">
          <CheckBox
            isChecked={showAutomation}
            onClick={() => {
              setShowAutomation(!showAutomation);
              update({
                ...circle.sidebarConfig,
                showAutomation: !showAutomation,
              });
            }}
          />
          <Text>Show Automation Center</Text>
        </Stack>
        <Stack direction="horizontal">
          <CheckBox
            isChecked={showGovernance}
            onClick={() => {
              setShowGovernance(!showGovernance);
              update({
                ...circle.sidebarConfig,
                showGovernance: !showGovernance,
              });
            }}
          />
          <Text>Show Governance Center</Text>
        </Stack>
        <Stack direction="horizontal">
          <CheckBox
            isChecked={showMembership}
            onClick={() => {
              setShowMembership(!showMembership);
              update({
                ...circle.sidebarConfig,
                showMembership: !showMembership,
              });
            }}
          />
          <Text>Show Membership Center</Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SidebarConfig;
