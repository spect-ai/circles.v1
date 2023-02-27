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
import { useRouter } from "next/router";

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 6rem);
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
  height: 4rem;
`;

export default function AutomationCenter() {
  const { circle } = useCircle();
  const { canDo } = useRoleGate();
  const router = useRouter();
  const { mode } = useTheme();

  if (circle) {
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
        <Box marginX={"4"}>
          {(circle?.automations === undefined ||
            Object.entries(circle?.automations).length == 0) && (
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
            {circle.automationsIndexedByCollection !== undefined &&
              Object.keys(circle?.automationsIndexedByCollection).map(
                (collection) => {
                  const automations =
                    circle.automationsIndexedByCollection[collection];
                  if (automations.length === 0) return null;
                  const col = Object.values(circle.collections).find((col) => {
                    return col.slug === collection;
                  });
                  return (
                    <Box>
                      <Automation collection={col as CollectionType} />
                      <Row id="row">
                        {automations?.map((auto, idx) => {
                          const automat = circle.automations[auto];
                          return (
                            <Col
                              md={3}
                              style={{ padding: "0rem", marginLeft: "1rem" }}
                            >
                              <Container mode={mode}>
                                <Text
                                  variant="base"
                                  color={"textTertiary"}
                                  align="center"
                                  ellipsis
                                >
                                  {automat.name}
                                </Text>
                              </Container>
                            </Col>
                          );
                        })}
                      </Row>
                    </Box>
                  );
                }
              )}
          </ScrollContainer>
        </Box>
      </>
    );
  } else {
    return null;
  }
}
