import Card from "@/app/common/components/Card";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import { ExpandAltOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  Stack,
  Text,
  useTheme,
  IconExclamationCircleSolid,
} from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import CreateRetro from "../../../Retro/CreateRetro";
import { useCircle } from "../../CircleContext";
import CreateCollectionModal from "../../CreateCollectionModal";
import CreateProjectModal from "../../CreateProjectModal";
import CreateSpaceModal from "../../CreateSpaceModal";

interface Props {
  filteredProjects: {
    [key: string]: ProjectType;
  };
  filteredRetro: {
    [key: string]: RetroType;
  };
  filteredWorkstreams: {
    [key: string]: CircleType;
  };
  filteredCollections: {
    [key: string]: CollectionType;
  };
  setIsRetroOpen: (isRetroOpen: boolean) => void;
}

const BoxContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 11rem);
  overflow-y: auto;
  margin-top: 1.2rem;
`;

export const TypeView = ({
  filteredProjects,
  filteredCollections,
  filteredWorkstreams,
  filteredRetro,
  setIsRetroOpen,
}: Props) => {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { setPage } = useCircle();
  const { canDo } = useRoleGate();

  const { mode } = useTheme();

  return (
    <BoxContainer>
      <Stack direction="horizontal">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Projects
        </Text>
        {canDo("createNewProject") && <CreateProjectModal />}
      </Stack>
      <Container
        style={{
          padding: "0px",
          marginTop: "1rem",
          marginLeft: "0px",
        }}
      >
        <Row>
          {filteredProjects &&
            Object.values(filteredProjects)?.map((project) => (
              <Col sm={6} md={4} lg={2} key={project.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`${window.location.href}/${project.slug}`)
                  }
                  height="32"
                >
                  <Text align="center" wordBreak="break-word">
                    {project.name}
                  </Text>
                  {project.description.length > 0 && (
                    <Tooltip
                      html={<Text>{project.description}</Text>}
                      theme={mode}
                      position="bottom"
                    >
                      <Box
                        style={{
                          marginTop: "0.5rem",
                          transform: "rotate(180deg)",
                          opacity: "40%",
                        }}
                      >
                        <IconExclamationCircleSolid size={"4"} color="text" />
                      </Box>
                    </Tooltip>
                  )}
                </Card>
              </Col>
            ))}
          {filteredProjects && Object.values(filteredProjects)?.length == 0 && (
            <Box margin="4">
              <Text variant="label">No Projects created yet</Text>
            </Box>
          )}
        </Row>
      </Container>
      <Stack direction="horizontal">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Workstreams
        </Text>
        {canDo("createNewCircle") && <CreateSpaceModal />}
      </Stack>
      <Container
        style={{
          padding: "0px",
          marginTop: "1rem",
          marginLeft: "0px",
        }}
      >
        <Row>
          {filteredWorkstreams &&
            Object.values(filteredWorkstreams)?.map((space) => (
              <Col sm={6} md={4} lg={2} key={space.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`/${space.slug}`)
                  }
                  height="32"
                >
                  <Text align="center" wordBreak="break-word">
                    {space.name}
                  </Text>
                  {space?.description?.length > 0 && (
                    <Tooltip
                      html={<Text>{space.description}</Text>}
                      theme={mode}
                      position="bottom"
                    >
                      <Box
                        style={{
                          marginTop: "0.5rem",
                          transform: "rotate(180deg)",
                          opacity: "40%",
                        }}
                      >
                        <IconExclamationCircleSolid size={"4"} color="text" />
                      </Box>
                    </Tooltip>
                  )}
                </Card>
              </Col>
            ))}
          {filteredWorkstreams && !Object.values(filteredWorkstreams)?.length && (
            <Box margin="4">
              <Text variant="label">No Workstreams created yet</Text>
            </Box>
          )}
        </Row>
      </Container>
      <Stack direction="horizontal" align="center">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Forms
        </Text>
        {canDo("createNewRetro") && <CreateCollectionModal />}
      </Stack>
      <Container
        style={{
          padding: "0px",
          marginTop: "1rem",
          marginLeft: "0px",
        }}
      >
        <Row>
          {filteredCollections &&
            Object.values(filteredCollections)?.map((collection) => (
              <Col sm={6} md={4} lg={2} key={collection.id}>
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`${window.location.href}/r/${collection.slug}`)
                  }
                  height="32"
                >
                  <Text align="center">{collection.name}</Text>
                </Card>
              </Col>
            ))}
          {filteredCollections && !Object.values(filteredCollections)?.length && (
            <Box margin="4">
              <Text variant="label">No Forms created yet</Text>
            </Box>
          )}
        </Row>
      </Container>
      <Stack direction="horizontal" align="center">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Retro
        </Text>
        {canDo("createNewRetro") && <CreateRetro />}
        <Tooltip html={<Text>View all Retros</Text>} theme={mode}>
          <Box marginTop="1">
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => setPage("Retro")}
            >
              <Text variant="label">
                <ExpandAltOutlined
                  style={{
                    fontSize: "1.2rem",
                  }}
                />
              </Text>
            </Button>
          </Box>
        </Tooltip>
      </Stack>
      <Container
        style={{
          padding: "0px",
          marginTop: "1rem",
          marginLeft: "0px",
        }}
      >
        <Row>
          {filteredRetro &&
            Object.values(filteredRetro)?.map((retro) => (
              <Col sm={6} md={4} lg={2} key={retro.id}>
                <Card
                  height="32"
                  onClick={() => {
                    void router.push(`${cId}?retroSlug=${retro.slug}`);
                    setIsRetroOpen(true);
                  }}
                >
                  <Text align="center" wordBreak="break-word">
                    {retro.title}
                  </Text>
                  {retro?.description?.length > 0 && (
                    <Tooltip
                      html={<Text>{retro?.description}</Text>}
                      theme={mode}
                      position="bottom"
                    >
                      <Box
                        style={{
                          marginTop: "0.5rem",
                          transform: "rotate(180deg)",
                          opacity: "40%",
                        }}
                      >
                        <IconExclamationCircleSolid size={"4"} color="text" />
                      </Box>
                    </Tooltip>
                  )}
                </Card>
              </Col>
            ))}
          {filteredRetro && !Object.values(filteredRetro)?.length && (
            <Box marginLeft="4">
              <Text variant="label">No Retros created yet</Text>
            </Box>
          )}
        </Row>
      </Container>
    </BoxContainer>
  );
};
