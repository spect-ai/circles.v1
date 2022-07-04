import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType } from "@/app/types";
import { ProjectOutlined } from "@ant-design/icons";
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
import CircleOptions from "./CircleOptions";
import CollapseButton from "./CollapseButton";

export const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 9.1rem);
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

  const [showCollapseButton, setShowCollapseButton] = useState(false);
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
    <Box
      padding="2"
      onMouseEnter={() => setShowCollapseButton(true)}
      onMouseLeave={() => setShowCollapseButton(false)}
    >
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
      <Stack space="3">
        <Stack direction="horizontal">
          <CircleOptions />
          <CollapseButton
            show={showCollapseButton}
            setShowCollapseButton={setShowCollapseButton}
            top="2.8rem"
            left="a"
          />
        </Stack>
        <Container>
          <Stack>
            <Accordian
              name="Projects"
              defaultOpen
              icon={<ProjectOutlined style={{ fontSize: "1.3rem" }} />}
            >
              <Stack space="0">
                {circle?.projects.map((proj) => (
                  <Stack key={proj.id} direction="horizontal" space="0">
                    <Box borderRightWidth="0.5" />
                    <Box width="full" padding="1">
                      <Link href={`/${cId}/${proj.slug}`}>
                        <PrimaryButton
                          variant={
                            pId === proj.slug ? "tertiary" : "transparent"
                          }
                        >
                          {proj.name}
                        </PrimaryButton>
                      </Link>
                    </Box>
                  </Stack>
                ))}
                {!circle?.projects.length && (
                  <Box paddingLeft="7" paddingY="2">
                    <Text variant="label">No projects created</Text>
                  </Box>
                )}
              </Stack>
            </Accordian>
            <Accordian
              name="Workstreams"
              defaultOpen
              icon={<IconCollection />}
              // buttonComponent={<CreateSpaceModal accordian />}
            >
              {/* <Stack>
                {circle?.children.map((space) => (
                  <Link href={`/${space.slug}`} key={space.id}>
                    <Button
                      prefix={}
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
                    <Text variant="label">No workstreams created</Text>
                  </Box>
                )}
              </Stack> */}
              <Stack space="0">
                {circle?.children.map((space) => (
                  <Stack key={space.id} direction="horizontal" space="0">
                    <Box borderRightWidth="0.5" />
                    <Box width="full" padding="1">
                      <Link href={`/${space.slug}`} key={space.id}>
                        <PrimaryButton variant="transparent">
                          {space.name}
                        </PrimaryButton>
                      </Link>
                    </Box>
                  </Stack>
                ))}
                {!circle?.projects.length && (
                  <Box paddingLeft="7" paddingY="2">
                    <Text variant="label">No projects created</Text>
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
