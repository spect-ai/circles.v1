import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Input, IconSearch } from "degen";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BatchPay from "../../Project/BatchPay";
import RetroModal from "../../Retro/RetroModal";
import { useCircle } from "../CircleContext";
import CircleMembers from "../CircleMembers";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import { FolderView } from "./FolderView";
import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Roles from "../RolesTab";
import { Hidden } from "react-grid-system";
import styled from "styled-components";

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
  const { isSidebarExpanded, toggle, setToggle } = useGlobal();
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;
  const {
    circle,
    setIsBatchPayOpen,
    isBatchPayOpen,
    retro,
    navigationBreadcrumbs,
  } = useCircle();
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(circle?.projects);
  const [filteredCollections, setFilteredCollections] = useState(
    circle?.collections
  );
  const [filteredWorkstreams, setFilteredWorkstreams] = useState(
    circle?.children
  );
  const [filteredRetro, setFilteredRetro] = useState(circle?.retro);

  useEffect(() => {
    setFilteredProjects(circle?.projects);
    setFilteredWorkstreams(circle?.children);
    setFilteredRetro(circle?.retro);
    setFilteredCollections(circle?.collections);
  }, [circle]);

  useEffect(() => {
    if (retroSlug) {
      setIsRetroOpen(true);
    }
  }, [retroSlug]);

  return (
    <Box>
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
            filteredRetro={filteredRetro}
            filteredProjects={filteredProjects}
            filteredWorkstreams={filteredWorkstreams}
            setIsRetroOpen={setIsRetroOpen}
          />
        </Stack>
      </Box>
    </Box>
  );
}
