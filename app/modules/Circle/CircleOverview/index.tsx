import Breadcrumbs from "@/app/common/components/Breadcrumbs";
import { isSidebarExpandedAtom } from "@/app/state/global";
import { Box, Stack } from "degen";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Hidden } from "react-grid-system";
import { useCircle } from "../CircleContext";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import { FolderView } from "./FolderView";

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
            filteredWorkstreams={filteredWorkstreams}
          />
        </Stack>
      </Box>
    </Box>
  );
}
