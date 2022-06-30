import Accordian from "@/app/common/components/Accordian";
import { useGlobalContext } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType } from "@/app/types";
import { DoubleRightOutlined, ProjectOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconCollection,
  Skeleton,
  SkeletonGroup,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import SettingsModal from "../Circle/CircleSettingsModal";
import ContributorsModal from "../Circle/ContributorsModal";
import CreateProjectModal from "../Circle/CreateProjectModal";
import CreateSpaceModal from "../Circle/CreateSpaceModal";
import { SlideButtonContainer } from "../Header";
import CircleOptions from "./CircleOptions";

export const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 10rem);
  overflow-y: auto;
`;

function CircleSidebar() {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { canDo } = useRoleGate();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);

  const { setIsSidebarExpanded, isSidebarExpanded } = useGlobalContext();

  if (isLoading) {
    return (
      <SkeletonGroup loading>
        <Box marginTop="8" paddingX="4">
          <Stack space="4">
            <Skeleton width="full" height="8" />
            <Skeleton width="full" height="8" />
          </Stack>
        </Box>
      </SkeletonGroup>
    );
  }

  return (
    <Box padding="2">
      <AnimatePresence>
        {isSettingsModalOpen && (
          <SettingsModal handleClose={() => setIsSettingsModalOpen(false)} />
        )}
        {isContributorsModalOpen && (
          <ContributorsModal
            handleClose={() => setIsContributorsModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <Stack>
        <Stack direction="horizontal">
          <CircleOptions />
          {pId && (
            <SlideButtonContainer
              transitionDuration="300"
              style={{
                transform: isSidebarExpanded
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
              marginTop="2"
              marginBottom="2.5"
              cursor="pointer"
              color="textSecondary"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
              <DoubleRightOutlined style={{ fontSize: "1.1rem" }} />
            </SlideButtonContainer>
          )}
        </Stack>
        <Container>
          <Stack>
            <Accordian
              name="Projects"
              defaultOpen
              buttonComponent={<CreateProjectModal accordian />}
              showButton={canDo(["steward"])}
            >
              <Stack>
                {circle?.projects.map((proj) => (
                  <Link key={proj.id} href={`/${cId}/${proj.slug}`}>
                    <Button
                      prefix={
                        <ProjectOutlined
                          style={{
                            fontSize: "1.3rem",
                            marginLeft: "2px",
                            color:
                              pId === proj.slug ? "rgb(191, 90, 242, 1)" : "",
                            marginTop: "5px",
                          }}
                        />
                      }
                      center
                      width="full"
                      variant={pId === proj.slug ? "tertiary" : "transparent"}
                      size="small"
                    >
                      {proj.name}
                    </Button>
                  </Link>
                ))}
                {!circle?.projects.length && (
                  <Box paddingLeft="7" paddingY="2">
                    <Text variant="label">No projects created</Text>
                  </Box>
                )}
              </Stack>
            </Accordian>
            <Accordian
              name="Workspaces"
              defaultOpen
              buttonComponent={<CreateSpaceModal accordian />}
              showButton={canDo(["steward"])}
            >
              <Stack>
                {circle?.children.map((space) => (
                  <Link href={`/${space.slug}`} key={space.id}>
                    <Button
                      prefix={<IconCollection />}
                      center
                      width="full"
                      variant="transparent"
                      size="small"
                    >
                      {space.name}
                    </Button>
                  </Link>
                ))}
                {!circle?.children.length && (
                  <Box paddingLeft="7" paddingY="2">
                    <Text variant="label">No workspaces created</Text>
                  </Box>
                )}
              </Stack>
            </Accordian>
          </Stack>
        </Container>
      </Stack>
    </Box>
  );
}

export default memo(CircleSidebar);
