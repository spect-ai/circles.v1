import Card from "@/app/common/components/Card";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Col, Container, Row } from "react-grid-system";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import CreateRetro from "../../Retro/CreateRetro";
import { useCircle } from "../CircleContext";
import CreateCollectionModal from "../CreateCollectionModal";
import CreateProjectModal from "../CreateProjectModal";
import CreateSpaceModal from "../CreateSpaceModal";

interface Props {
  filteredProjects: ProjectType[] | undefined;
  filteredRetro: RetroType[] | undefined;
  filteredWorkstreams: CircleType[] | undefined;
  filteredCollections: CollectionType[] | undefined;
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
  setIsRetroOpen
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
          {filteredProjects?.map((project) => (
            <Col sm={6} md={4} lg={2} key={project.id}>
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
          {!filteredProjects?.length && (
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
          {filteredWorkstreams?.map((space) => (
            <Col sm={6} md={4} lg={2} key={space.id}>
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
          {!filteredWorkstreams?.length && (
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
          {filteredCollections?.map((collection) => (
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
          {!filteredCollections?.length && (
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
          {filteredRetro?.map((retro) => (
            <Col sm={6} md={4} lg={2} key={retro.id}>
              <Card
                height="32"
                onClick={() => {
                  void router.push(`${cId}?retroSlug=${retro.slug}`);
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
          {!filteredRetro?.length && (
            <Box marginLeft="4">
              <Text variant="label">No Retros created yet</Text>
            </Box>
          )}
        </Row>
      </Container>
    </BoxContainer>
  );
};
