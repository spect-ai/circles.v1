import PrimaryButton from "@/app/common/components/PrimaryButton";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useCircle } from "../CircleContext";
import { AutomationHeading } from "./AutomationHeading";

export default function Automation() {
  const { localCircle: circle } = useCircle();
  const { canDo } = useRoleGate();
  const { mode } = useTheme();
  
  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <AutomationHeading />
      <Box margin={"4"}>
        {(circle?.automationsIndexedByCollection === undefined ||
          Object.entries(circle?.automationsIndexedByCollection)?.length ==
            0) && (
          <Box
            style={{
              margin: "12% 20%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <GatewayOutlined
              style={{ fontSize: "5rem", color: "rgb(191, 90, 242, 0.7)" }}
            />
            <Text variant="large" color={"textTertiary"} align="center">
              {canDo("manageCircleSettings")
                ? `Create Automations to reduce repetitive tasks.`
                : `Ouch ! This Circle doesnot have automations. And You do not have permission to create new automations.`}
            </Text>
          </Box>
        )}
        {circle.automationsIndexedByCollection !== undefined &&
          Object.keys(circle?.automationsIndexedByCollection).map(
            (collection) => {
              const automations =
                circle.automationsIndexedByCollection[collection];
              if(automations.length === 0) return null;
              const col = Object.values(circle.collections).find((col) => {
                return col.slug === collection;
              })
              return (
                <Box
                  key={collection}
                  borderRadius="large"
                  style={{
                    padding: "1rem",
                    border: "2px solid gray",
                  }}
                >
                  <Text variant="large" color={"textTertiary"} align="center">
                    {col?.name}
                  </Text>
                  {automations?.map((auto, idx) => {
                    const automation = circle.automations[auto];
                    return (
                      <Box key={automation.id}>
                        <Text>{automation.name} </Text>
                      </Box>
                    );
                  })}
                </Box>
              );
            }
          )}
      </Box>
    </>
  );
}
