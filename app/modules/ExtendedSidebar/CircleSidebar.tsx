import Accordian from "@/app/common/components/Accordian";
import { CircleType } from "@/app/types";
import { AppstoreOutlined, ProjectOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconCog,
  IconCollection,
  IconUsersSolid,
  Skeleton,
  SkeletonGroup,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import SettingsModal from "../Circle/CircleSettingsModal";
import ContributorsModal from "../Circle/ContributorsModal";
import CreateProjectModal from "../Circle/CreateProjectModal";
import CreateSpaceModal from "../Circle/CreateSpaceModal";

export default function CircleSidebar() {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);

  const overviewTab = cId && !pId ? true : false;

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
    <>
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
        <Accordian name={circle?.name as string} defaultOpen>
          <Stack>
            <Link href={`/${cId}`}>
              <Button
                prefix={
                  <AppstoreOutlined
                    style={{
                      fontSize: "1.3rem",
                      marginLeft: "2px",
                      color: overviewTab ? "rgb(175, 82, 222, 1)" : "",
                    }}
                  />
                }
                center
                width="full"
                variant={overviewTab ? "tertiary" : "transparent"}
                size="small"
              >
                Overview
              </Button>
            </Link>
            <Button
              prefix={
                <IconCog color={isSettingsModalOpen ? "accent" : "current"} />
              }
              center
              width="full"
              variant={isSettingsModalOpen ? "tertiary" : "transparent"}
              size="small"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              Settings
            </Button>
            <Button
              prefix={
                <IconUsersSolid
                  color={isContributorsModalOpen ? "accent" : "current"}
                />
              }
              center
              width="full"
              variant={isContributorsModalOpen ? "tertiary" : "transparent"}
              size="small"
              onClick={() => setIsContributorsModalOpen(true)}
            >
              Contributors
            </Button>
          </Stack>
        </Accordian>
        <Accordian
          name="Projects"
          defaultOpen
          buttonComponent={<CreateProjectModal accordian />}
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
                        color: pId === proj.slug ? "rgb(175, 82, 222, 1)" : "",
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
    </>
  );
}
