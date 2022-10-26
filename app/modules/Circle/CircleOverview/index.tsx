import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

import {
  Box,
  Button,
  Stack,
  useTheme,
  Input,
  IconSearch,
  IconGrid,
} from "degen";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState, FunctionComponent } from "react";
import styled from "styled-components";
import BatchPay from "../../Project/BatchPay";
import RetroModal from "../../Retro/RetroModal";
import { useCircle } from "../CircleContext";
import CircleMembers from "../CircleMembers";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import { TypeView } from "./TypeView";
import { FolderView } from "./FolderView";
import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import Roles from "../RolesTab";
import { FolderOpenOutlined } from "@ant-design/icons";

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

const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <Box
      backgroundColor={mode === "dark" ? "background" : "white"}
      style={{
        display: "block",
        padding: "0.2rem",
        borderRadius: "2rem",
        width: "20rem",
        margin: "0rem auto",
        marginBottom: "0.5rem",
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
        Contributors
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle("Roles")}
        bgcolor={toggle == "Roles" ? true : false}
      >
        Roles
      </ToggleButton>
    </Box>
  );
};

export default function CircleOverview() {
  const { isSidebarExpanded, groupBy, setGroupBy, toggle, setToggle } =
    useGlobal();
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;
  const {
    localCircle: circle,
    setIsBatchPayOpen,
    isBatchPayOpen,
    retro,
    navigationBreadcrumbs,
  } = useCircle();
  const { canDo } = useRoleGate();
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
      <Box marginTop="1">
        {navigationBreadcrumbs && (
          <Breadcrumbs crumbs={navigationBreadcrumbs} />
        )}
      </Box>
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
            <Stack space="2">
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: "1rem",
                }}
              >
                <Input
                  label=""
                  placeholder="Search projects, workstreams, retros"
                  prefix={<IconSearch />}
                  onChange={(e) => {
                    const proj = matchSorter(
                      Object.values(circle?.projects),
                      e.target.value,
                      {
                        keys: ["name"],
                      }
                    );
                    const workstream = matchSorter(
                      Object.values(circle?.children),
                      e.target.value,
                      {
                        keys: ["name"],
                      }
                    );
                    const retro = matchSorter(
                      Object.values(circle?.retro),
                      e.target.value,
                      {
                        keys: ["title"],
                      }
                    );
                    const collections = matchSorter(
                      Object.values(circle?.collections),
                      e.target.value,
                      {
                        keys: ["name"],
                      }
                    );
                    setFilteredProjects(
                      proj.reduce((rest, p) => ({ ...rest, [p.id]: p }), {})
                    );
                    setFilteredWorkstreams(
                      workstream.reduce(
                        (rest, w) => ({ ...rest, [w.id]: w }),
                        {}
                      )
                    );
                    setFilteredRetro(
                      retro.reduce((rest, r) => ({ ...rest, [r.id]: r }), {})
                    );
                    setFilteredCollections(
                      collections.reduce(
                        (rest, c) => ({ ...rest, [c.id]: c }),
                        {}
                      )
                    );
                  }}
                />
                <Button
                  size="small"
                  variant="secondary"
                  shape="circle"
                  onClick={() =>
                    setGroupBy(groupBy == "Type" ? "Folder" : "Type")
                  }
                >
                  {groupBy == "Type" ? (
                    <IconGrid size={"4"} />
                  ) : (
                    <FolderOpenOutlined style={{ fontSize: "1.1rem" }} />
                  )}
                </Button>
                {canDo("inviteMembers") && (
                  <Box width={"1/3"} marginBottom="1">
                    <InviteMemberModal />
                  </Box>
                )}
              </Box>
              {groupBy == "Type" && (
                <TypeView
                  filteredCollections={filteredCollections}
                  filteredRetro={filteredRetro}
                  filteredProjects={filteredProjects}
                  filteredWorkstreams={filteredWorkstreams}
                  setIsRetroOpen={setIsRetroOpen}
                />
              )}
              {groupBy == "Folder" && (
                <FolderView
                  filteredCollections={filteredCollections}
                  filteredRetro={filteredRetro}
                  filteredProjects={filteredProjects}
                  filteredWorkstreams={filteredWorkstreams}
                  setIsRetroOpen={setIsRetroOpen}
                />
              )}
            </Stack>
          )}
          {toggle == "Members" && <CircleMembers />}
          {toggle == "Roles" && <Roles />}
        </Box>
      </Stack>
    </>
  );
}
