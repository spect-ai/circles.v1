import { Box, Stack } from "degen";
import { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import { FolderView } from "./FolderView";
import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { Hidden } from "react-grid-system";
import styled from "styled-components";
import { useAtom } from "jotai";
import { isSidebarExpandedAtom } from "@/app/state/global";

interface Props {
  toggle: number;
  setToggle: (toggle: number) => void;
}

const ToggleButton = styled.button<{ bgcolor: boolean }>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  transition-duration: 0.4s;
  color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "rgb(191,90,242,0.8)"};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242,0.1)" : "transparent"};
`;

export const Toggle = ({ toggle, setToggle }: Props) => {
  return (
    <Box
      backgroundColor="backgroundSecondary"
      style={{
        borderRadius: "2rem",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      <ToggleButton
        onClick={() => setToggle(0)}
        bgcolor={toggle == 0 ? true : false}
      >
        Overview
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle(1)}
        bgcolor={toggle == 1 ? true : false}
      >
        Contributors
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle(2)}
        bgcolor={toggle == 2 ? true : false}
      >
        Roles
      </ToggleButton>
    </Box>
  );
};

export default function CircleDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useAtom(
    isSidebarExpandedAtom
  );
  const { circle, navigationBreadcrumbs } = useCircle();
  const [filteredProjects, setFilteredProjects] = useState(circle?.projects);
  const [filteredCollections, setFilteredCollections] = useState(
    circle?.collections
  );
  const [filteredWorkstreams, setFilteredWorkstreams] = useState(
    circle?.children
  );

  useEffect(() => {
    setFilteredProjects(circle?.projects);
    setFilteredWorkstreams(circle?.children);
    setFilteredCollections(circle?.collections);
  }, [circle]);

  return (
    <Box>
      <Box marginBottom="-4">
        <Stack direction="horizontal" justify="space-between">
          <Hidden xs sm>
            {navigationBreadcrumbs && (
              <Breadcrumbs crumbs={navigationBreadcrumbs} />
            )}
          </Hidden>
          <Hidden xs sm>
            <Box width="24">
              <InviteMemberModal />
            </Box>
          </Hidden>
        </Stack>
      </Box>
      <Box
        style={{
          width: isSidebarExpanded ? "75%" : "100%",
          alignItems: "center",
        }}
        transitionDuration="500"
      >
        <Stack space="1">
          <FolderView
            filteredCollections={filteredCollections}
            filteredProjects={filteredProjects}
            filteredWorkstreams={filteredWorkstreams}
          />
        </Stack>
      </Box>
    </Box>
  );
}
