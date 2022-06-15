import Card from "@/app/common/components/Card";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Box, Heading, Stack, Text } from "degen";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { useQuery } from "react-query";
import CreateSpaceModal from "../CreateSpaceModal";

export default function Circle() {
  const { data: circle } = useQuery<Circle>("circle");
  return (
    <Box padding="8">
      <Stack>
        <Heading>Description</Heading>
        <Text>This is a test project</Text>
        <Heading>Projects</Heading>
        <Container style={{ width: "100%", padding: "0px" }}>
          <Row>
            <Col sm={3}>
              <Card height="32" dashed onClick={() => console.log()}>
                <Box width="32">
                  <Stack align="center">
                    <Text align="center">Create Project</Text>
                  </Stack>
                </Box>
              </Card>
            </Col>
          </Row>
        </Container>
        <Heading>Workspaces</Heading>
        <Container style={{ width: "100%", padding: "0px" }}>
          <Row>
            <Col sm={3}>
              <CreateSpaceModal />
            </Col>
          </Row>
        </Container>
      </Stack>
    </Box>
  );
}
