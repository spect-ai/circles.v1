import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import { CircleType } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { useQuery } from "react-query";
import CreateProjectModal from "./CreateProjectModal";
import CreateSpaceModal from "./CreateSpaceModal";

export default function Circle() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  if (isLoading) {
    return <Loader text="...." loading />;
  }
  return (
    <Box padding="8">
      <Stack>
        <Heading>Description</Heading>
        <Text>This is a test project</Text>
        <Heading>Projects</Heading>
        <Container style={{ width: "100%", padding: "0px", margin: "0px" }}>
          <Row>
            {circle?.projects.map((project) => (
              <Col sm={3} key={project.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`${window.location.href}/${project.slug}`)
                  }
                  height="32"
                >
                  <Text>{project.name}</Text>
                  <Text variant="label" align="center">
                    This is our sprint board
                  </Text>
                </Card>
              </Col>
            ))}
            <Col sm={3}>
              <CreateProjectModal />
            </Col>
          </Row>
        </Container>
        <Heading>Workspaces</Heading>
        <Container style={{ width: "100%", padding: "0px", margin: "0px" }}>
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
