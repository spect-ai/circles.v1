import {
  Box,
  Heading,
  IconPlusSmall,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import React, { useEffect, useState } from "react";
import FlowEditor from "./Editor/FlowEditor";
import { Flow } from "@avp1598/spect-shared-types";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Modal from "@/app/common/components/Modal";
import { AnimatePresence } from "framer-motion";
import { createFlow, getWorkflows } from "@/app/services/Workflows";
import { useCircle } from "../CircleContext";
import styled from "@emotion/styled";
import { Col, Row } from "react-grid-system";

type Props = {};

const Workflows = (props: Props) => {
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow>();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [flowName, setFlowName] = useState("");
  const { mode } = useTheme();

  const { circle } = useCircle();

  useEffect(() => {
    (async () => {
      const res = await getWorkflows(circle?.id || "");
      if (res) {
        setFlows(res);
      }
    })();
  }, [editingFlow]);

  return (
    <Box width="full" height="full">
      {editingFlow ? (
        <FlowEditor flow={editingFlow} setEditingFlow={setEditingFlow} />
      ) : (
        <Box padding="8">
          <AnimatePresence>
            {isCreateFlowOpen && (
              <Modal
                title="Create flow"
                handleClose={() => setIsCreateFlowOpen(false)}
                size="small"
              >
                <Box padding="8">
                  <Stack space="4">
                    <Input
                      placeholder="Flow name"
                      label=""
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                    />
                    <Box width="1/3">
                      <PrimaryButton
                        icon={<IconPlusSmall size="5" />}
                        onClick={async () => {
                          const res = await createFlow({
                            name: flowName,
                            circle: circle?.id || "",
                          });
                          if (res) {
                            setIsCreateFlowOpen(false);
                            setEditingFlow(res);
                            setFlowName("");
                          }
                        }}
                      >
                        Create flow
                      </PrimaryButton>
                    </Box>
                  </Stack>
                </Box>
              </Modal>
            )}
          </AnimatePresence>
          <Stack space="4">
            <Heading>Workflows</Heading>
            <Box width="1/3">
              <PrimaryButton
                icon={<IconPlusSmall size="5" />}
                onClick={() => setIsCreateFlowOpen(true)}
              >
                Create flow
              </PrimaryButton>
            </Box>
            <Row id="row" style={{ padding: "0rem" }}>
              {flows.map((flow) => (
                <Col md={3} key={flow.id}>
                  <Container
                    mode={mode}
                    onClick={() => {
                      setEditingFlow(flow);
                    }}
                    id="container"
                  >
                    <Text
                      variant="base"
                      color={"textTertiary"}
                      align="center"
                      ellipsis
                    >
                      {flow.name}
                    </Text>
                  </Container>
                </Col>
              ))}
            </Row>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

const Container = styled(Box)<{ mode: string }>`
  color: rgb(191, 90, 242, 0.7);
  padding: 1rem;
  margin-bottom: 0.5rem;
  height: 4rem;
  cursor: pointer;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 90%
  };

  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  border-width: 2px;
  border-radius: 0.5rem;
  border-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.05)" : "rgb(20,20,20,0.05)"};
  };


`;

export default Workflows;
