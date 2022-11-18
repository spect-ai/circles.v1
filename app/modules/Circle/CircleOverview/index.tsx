import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, Stack, Input, IconSearch, IconGrid } from "degen";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
        <Hidden xs sm>
          {navigationBreadcrumbs && (
            <Breadcrumbs crumbs={navigationBreadcrumbs} />
          )}
        </Hidden>
      </Box>
      <Stack direction="horizontal">
        <Box
          style={{
            width: isSidebarExpanded ? "75%" : "100%",
            alignItems: "center",
          }}
          transitionDuration="500"
        >
          {/* <Box width={{ lg: "112"}} marginX="auto">
            <Tabs
              selectedTab={toggle}
              onTabClick={onTabClick}
              tabs={["Overview", "Contributors", "Roles"]}
              tabTourIds={[
                "circle-dashboard-overview",
                "circle-dashboard-contributor",
                "circle-dashboard-roles",
              ]}
              orientation="horizontal"
              unselectedColor="transparent"
              selectedColor="secondary"
            />
          </Box> */}
          <Toggle toggle={toggle} setToggle={setToggle} />

          {toggle == 0 && (
            <Stack space="1">
              <Stack
                direction={{
                  xs: "vertical",
                  md: "horizontal",
                }}
                align="flex-end"
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
                <Box
                  width="full"
                  display="flex"
                  flexDirection="row"
                  alignItems="flex-start"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  gap="4"
                >
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
                    <Box width="1/2">
                      <InviteMemberModal />
                    </Box>
                  )}
                </Box>
              </Stack>
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
          {toggle == 1 && <CircleMembers />}
          {toggle == 2 && <Roles />}
        </Box>
      </Stack>
    </>
  );
}
