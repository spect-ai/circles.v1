import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import { useGlobal } from "@/app/context/globalContext";
import useCircleOnboarding from "@/app/services/Onboarding/useCircleOnboarding";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, RetroType } from "@/app/types";
import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Col, Container, Row } from "react-grid-system";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CreateRetro from "../Retro/CreateRetro";
import RetroModal from "../Retro/RetroModal";
import CircleMembers from "./CircleMembers";
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
  const { isSidebarExpanded } = useGlobal();
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const [retro, setRetro] = useState({} as RetroType);

  if (isLoading || !circle) {
    return <Loader text="...." loading />;
  }

  console.log({ circle });

  return (
    <BoxContainer paddingX="8" paddingTop="4">
      {!onboarded && canDo(["steward"]) && <Onboarding />}
      <AnimatePresence>
        {isRetroOpen && (
          <RetroModal
            handleClose={() => setIsRetroOpen(false)}
            retro={retro}
            setRetro={setRetro}
          />
        )}
      </AnimatePresence>
      <ToastContainer
        toastStyle={{
          backgroundColor: "rgb(20,20,20)",
          color: "rgb(255,255,255,0.7)",
        }}
      />
      <Stack direction="horizontal">
        <Box
          style={{
            width: isSidebarExpanded ? "55%" : "75%",
          }}
          transitionDuration="500"
        >
          <Stack>
            <Text size="headingTwo" weight="semiBold" ellipsis>
              Description
            </Text>

            <Text>{circle?.description}</Text>
            <Stack direction="horizontal">
              <Text size="headingTwo" weight="semiBold" ellipsis>
                Projects
              </Text>
              {canDo(["steward"]) && <CreateProjectModal />}
            </Stack>
            <Container
              style={{
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
                {!circle.projects.length && (
                  <Box marginLeft="4">
                    <Text variant="label">No Projects created yet</Text>
                  </Box>
                )}
              </Row>
            </Container>
            <Stack direction="horizontal">
              <Text size="headingTwo" weight="semiBold" ellipsis>
                Workstreams
              </Text>
              {canDo(["steward"]) && <CreateSpaceModal />}
            </Stack>
            <Container style={{ padding: "0px", margin: "0px" }}>
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
                {!circle.children.length && (
                  <Box marginLeft="4">
                    <Text variant="label">No Workstreams created yet</Text>
                  </Box>
                )}
              </Row>
            </Container>
            <Stack direction="horizontal">
              <Text size="headingTwo" weight="semiBold" ellipsis>
                Retro
              </Text>
              {canDo(["steward"]) && <CreateRetro />}
              <Tooltip html={<Text>View all Retros</Text>}>
                <Button shape="circle" size="small" variant="transparent">
                  <Text variant="label">
                    <ExpandAltOutlined
                      style={{
                        fontSize: "1.2rem",
                      }}
                    />
                  </Text>
                </Button>
              </Tooltip>
            </Stack>
            <Container style={{ padding: "0px", margin: "0px" }}>
              <Row>
                {circle?.retro?.map((retro) => (
                  <Col sm={6} md={4} lg={3} key={retro.id}>
                    <Card
                      height="32"
                      onClick={() => {
                        setRetro(retro);
                        setIsRetroOpen(true);
                      }}
                    >
                      <Text align="center">{retro.title}</Text>
                      <Text variant="label" align="center">
                        {retro.description}
                      </Text>
                    </Card>
                  </Col>
                ))}
                {!circle.retro?.length && (
                  <Box marginLeft="4">
                    <Text variant="label">No Workstreams created yet</Text>
                  </Box>
                )}
              </Row>
            </Container>
          </Stack>
        </Box>
        <Box
          style={{
            width: isSidebarExpanded ? "25%" : "25%",
          }}
          transitionDuration="500"
        >
          <CircleMembers />
        </Box>
      </Stack>
    </BoxContainer>
  );
}
