import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import { CircleType } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { useQuery } from "react-query";
import styled from "styled-components";
import CreateProjectModal from "./CreateProjectModal";
import CreateSpaceModal from "./CreateSpaceModal";

const BoxContainer = styled(Box)`
  width: calc(100vw - 4rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 5rem);
  overflow-y: auto;
`;

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
    <BoxContainer padding="8">
      <Stack>
        <Heading>Description</Heading>
        <Text>This is a test project</Text>
        <Heading>Projects</Heading>
        <Container
          style={{
            width: "75%",
            padding: "0px",
            margin: "0px",
          }}
        >
          <Row>
            {circle?.projects.map((project) => (
              <Col sm={6} md={4} lg={3} key={project.id}>
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
            <Col sm={6} md={4} lg={3}>
              <CreateProjectModal />
            </Col>
          </Row>
        </Container>
        <Heading>Workspaces</Heading>
        <Container style={{ width: "75%", padding: "0px", margin: "0px" }}>
          <Row>
            <Col sm={6} md={4} lg={3}>
              <CreateSpaceModal />
            </Col>
          </Row>
        </Container>
      </Stack>
    </BoxContainer>
  );
}
