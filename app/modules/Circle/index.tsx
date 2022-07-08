import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import queryClient from "@/app/common/utils/queryClient";
import { joinCircleFromDiscord } from "@/app/services/JoinCircle";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Onboarding from "./CircleOnboarding";
import CreateProjectModal from "./CreateProjectModal";
import CreateSpaceModal from "./CreateSpaceModal";

const BoxContainer = styled(Box)`
  width: calc(100vw - 4rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 1rem);
  overflow-y: auto;
`;

export default function Circle() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { canDo } = useRoleGate();
  const { onboarded } = useCircleOnboarding();
  if (isLoading || !circle) {
    return <Loader text="...." loading />;
  }
  return (
    <BoxContainer paddingX="8" paddingTop="4">
      <Box width="1/3">
        <PrimaryButton
          onClick={async () => {
            const data = await joinCircleFromDiscord(circle.id);
            if (data) {
              queryClient.setQueryData(["circle", cId], data);
            }
          }}
        >
          Join Circle
        </PrimaryButton>
      </Box>
      {!onboarded && canDo(["steward"]) && <Onboarding />}
      <ToastContainer
        toastStyle={{
          backgroundColor: "rgb(20,20,20)",
          color: "rgb(255,255,255,0.7)",
        }}
      />
      <Stack>
        <Heading>Description</Heading>
        <Text>{circle?.description}</Text>
        <Heading>Projects</Heading>
        <Container
          style={{
            width: "75%",
            padding: "0px",
            margin: "0px",
          }}
        >
          <Row>
            {circle?.projects?.map((project) => (
              <Col sm={6} md={4} lg={3} key={project.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`${window.location.href}/${project.slug}`)
                  }
                  height="32"
                >
                  <Text align="center">{project.name}</Text>
                  <Text variant="label" align="center">
                    {project.description}
                  </Text>
                </Card>
              </Col>
            ))}
            <Col sm={6} md={4} lg={3}>
              {canDo(["steward"]) && <CreateProjectModal accordian={false} />}
            </Col>
          </Row>
        </Container>
        <Heading>Workstreams</Heading>
        <Container style={{ width: "75%", padding: "0px", margin: "0px" }}>
          <Row>
            {circle?.children?.map((space) => (
              <Col sm={6} md={4} lg={3} key={space.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`/${space.slug}`)
                  }
                  height="32"
                >
                  <Text align="center">{space.name}</Text>
                  <Text variant="label" align="center">
                    {space.description}
                  </Text>
                </Card>
              </Col>
            ))}
            <Col sm={6} md={4} lg={3}>
              {canDo(["steward"]) && <CreateSpaceModal accordian={false} />}
            </Col>
          </Row>
        </Container>
      </Stack>
    </BoxContainer>
  );
}
