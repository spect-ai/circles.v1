import Card from "@/app/common/components/Card";
import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType } from "@/app/types";
import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Text, useTheme, Input, IconSearch } from "degen";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState, FunctionComponent } from "react";
import { Col, Container, Row } from "react-grid-system";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import BatchPay from "../Project/BatchPay";
import CreateRetro from "../Retro/CreateRetro";
import RetroModal from "../Retro/RetroModal";
import { useCircle } from "./CircleContext";
import CircleMembers from "./CircleMembers";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateProjectModal from "./CreateProjectModal";
import CreateSpaceModal from "./CreateSpaceModal";
import InviteMemberModal from "./ContributorsModal/InviteMembersModal";

interface Props {
  toggle: string;
  setToggle: (toggle: "Overview" | "Members" | "Roles") => void;
}

const ToggleButton = styled.button<{ bgcolor: boolean }>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  font-size: 1rem;
  transition-duration: 0.4s;
  color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "rgb(191,90,242,0.8)"};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242,0.1)" : "transparent"};
`;

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

const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <Box
      backgroundColor={mode === "dark" ? "background" : "white"}
      style={{
        display: "block",
        padding: "0.2rem",
        borderRadius: "2rem",
        width: "13.6rem",
        margin: "1rem auto",
        boxShadow: `0px 1px 5px ${
          mode == "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"
        }`,
      }}
    >
      <ToggleButton
        onClick={() => setToggle("Overview")}
        bgcolor={toggle == "Overview" ? true : false}
      >
        Overview
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle("Members")}
        bgcolor={toggle == "Members" ? true : false}
      >
        Members
      </ToggleButton>
    </Box>
  );
};

export default function CircleOverview() {
  const { isSidebarExpanded } = useGlobal();
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;
  const { circle, setPage, setIsBatchPayOpen, isBatchPayOpen, retro } =
    useCircle();
  const { canDo } = useRoleGate();
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const [toggle, setToggle] =
    useState<"Overview" | "Members" | "Roles">("Overview");
  const [filteredProjects, setFilteredProjects] = useState(circle?.projects);
  const [filteredCollections, setFilteredCollections] = useState(
    circle?.collections
  );

  console.log(circle);
  const [filteredWorkstreams, setFilteredWorkstreams] = useState(
    circle?.children
  );
  const [filteredRetro, setFilteredRetro] = useState(circle?.retro);

  const { mode } = useTheme();

  useEffect(() => {
    if (retroSlug) {
      setIsRetroOpen(true);
    }
  }, [retroSlug]);

  if (circle?.unauthorized)
    return (
      <>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This circle is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </>
    );

  return (
    <>
      <AnimatePresence>
        {isRetroOpen && (
          <RetroModal
            handleClose={() => {
              setIsRetroOpen(false);
              void router.push(`/${cId}`);
            }}
          />
        )}
        {isBatchPayOpen && (
          <BatchPay setIsOpen={setIsBatchPayOpen} retro={retro} />
        )}
      </AnimatePresence>
      <Stack direction="horizontal">
        <Box
          style={{
            width: isSidebarExpanded ? "75%" : "100%",
            alignItems: "center",
          }}
          transitionDuration="500"
        >
          <Toggle toggle={toggle} setToggle={setToggle} />
          {toggle == "Overview" && (
            <>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Input
                  label=""
                  placeholder="Search anything .."
                  prefix={<IconSearch />}
                  onChange={(e) => {
                    setFilteredProjects(
                      matchSorter(
                        (circle as CircleType)?.projects,
                        e.target.value,
                        {
                          keys: ["name"],
                        }
                      )
                    );
                    setFilteredWorkstreams(
                      matchSorter(
                        (circle as CircleType)?.children,
                        e.target.value,
                        {
                          keys: ["name"],
                        }
                      )
                    );
                    setFilteredRetro(
                      matchSorter(
                        (circle as CircleType)?.retro,
                        e.target.value,
                        {
                          keys: ["name"],
                        }
                      )
                    );
                  }}
                />
                {canDo("inviteMembers") && (
                  <Box width={"1/3"} marginTop="2">
                    <InviteMemberModal />
                  </Box>
                )}
              </Box>
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
                            router.push(
                              `${window.location.href}/${project.slug}`
                            )
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
                    {!circle?.projects.length && (
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
                    {!circle?.children.length && (
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
                            router.push(
                              `${window.location.href}/r/${collection.slug}`
                            )
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
                      <Col sm={6} md={4} lg={3} key={retro.id}>
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
                    {!circle?.retro?.length && (
                      <Box marginLeft="4">
                        <Text variant="label">No Retros created yet</Text>
                      </Box>
                    )}
                  </Row>
                </Container>
              </BoxContainer>
            </>
          )}
          {toggle == "Members" && <CircleMembers />}
        </Box>
      </Stack>
    </>
  );
}
