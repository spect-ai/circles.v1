import Accordian from "@/app/common/components/Accordian";
import Modal from "@/app/common/components/Modal";
import { FlowRuns } from "@avp1598/spect-shared-types";
import {
  Box,
  Button,
  IconCollection,
  IconExclamation,
  IconSparkles,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Col, Row } from "react-grid-system";

type Props = {
  runs: FlowRuns;
};

const ViewRuns = ({ runs }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const reversedRuns = runs.slice().reverse();

  return (
    <Box>
      {/* <Tooltip title="View runs"> */}
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        shape="circle"
        size="small"
        variant="tertiary"
      >
        <IconCollection />
      </Button>
      {/* </Tooltip> */}
      <AnimatePresence>
        {isOpen && (
          <Modal title="Flow runs" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                {reversedRuns.map((run) => (
                  <Accordian
                    name={run.runId}
                    defaultOpen={false}
                    icon={
                      run.status === "failed" ? (
                        <IconExclamation color="red" size="5" />
                      ) : (
                        <IconSparkles />
                      )
                    }
                  >
                    <Stack>
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <Text variant="label">ID</Text>
                        </Col>
                        <Col>
                          <Text>{run.runId}</Text>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <Text variant="label">Status</Text>
                        </Col>
                        <Col>
                          <Text>{run.status}</Text>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <Text variant="label">Start time</Text>
                        </Col>
                        <Col>
                          <Text>{run.startTime}</Text>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <Text variant="label">End time</Text>
                        </Col>
                        <Col>
                          <Text>{run.endTime}</Text>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <Text variant="label">Outputs</Text>
                        </Col>
                        <Col>
                          <Text>{JSON.stringify(run.outputs)}</Text>
                        </Col>
                      </Row>
                    </Stack>
                  </Accordian>
                ))}
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ViewRuns;
