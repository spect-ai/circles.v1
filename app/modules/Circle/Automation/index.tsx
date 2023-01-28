import PrimaryButton from "@/app/common/components/PrimaryButton";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CollectionType } from "@/app/types";
import { GatewayOutlined } from "@ant-design/icons";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Automation from "../../Collection/Automation";
import { useCircle } from "../CircleContext";
import { AutomationHeading } from "./AutomationHeading";
import { Col, Row } from "react-grid-system";
import styled from "styled-components";
import { smartTrim } from "@/app/common/utils/utils";

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 13rem);
`;

const Container = styled(Box)<{ mode: string }>`
  border-width: 2px;
  border-radius: 0.5rem;
  border-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.05)" : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  color: rgb(191, 90, 242, 0.7);
  padding: 1rem;
  margin-bottom: 0.5rem;
  height: 9.5rem;
`;

export default function AutomationCenter() {
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
        <ScrollContainer
          id="scroll"
          style={{
            marginLeft: "0rem",
            alignItems: "center",
            paddingTop: "1rem",
          }}
        >
          <Row id="row">
            {circle.automationsIndexedByCollection !== undefined &&
              Object.keys(circle?.automationsIndexedByCollection).map(
                (collection) => {
                  const automations =
                    circle.automationsIndexedByCollection[collection];
                  if (automations.length === 0) return null;
                  const col = Object.values(circle.collections).find((col) => {
                    return col.slug === collection;
                  });
                  let automation = "";
                  automations?.map((auto, idx) => {
                    const automat = circle.automations[auto];
                    automation = automation.concat(automat.name + ", ");
                  });
                  return (
                    <Col sm={6} md={4} lg={4} key={collection} id="col">
                      <Container mode={mode} key={collection}>
                        <Automation collection={col as CollectionType} />
                        <Text wordBreak="break-word">{smartTrim(automation, 120)}</Text>
                      </Container>
                    </Col>
                  );
                }
              )}
          </Row>
        </ScrollContainer>
      </Box>
    </>
  );
}
