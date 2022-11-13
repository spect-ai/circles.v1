import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import Tabs from "@/app/common/components/Tabs";

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

export default function CircleDashboard() {
  const { isSidebarExpanded, groupBy, setGroupBy, toggle, setToggle } =
    useGlobal();
  const onTabClick = (id: number) => setToggle(id);
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
