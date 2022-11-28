import { Box } from "degen";
import React from "react";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import ProjectHeading from "./Heading";
import KanbanView from "./KanbanView";
import ProjectTableView from "./TableView";

export default function CollectionProject() {
  const { projectViewId, localCollection: collection } = useLocalCollection();
  return (
    <Box>
      <ProjectHeading />
      {collection.projectMetadata.views[projectViewId]?.type === "grid" && (
        <ProjectTableView />
      )}
      {collection.projectMetadata.views[projectViewId]?.type === "kanban" && (
        <KanbanView />
      )}
    </Box>
  );
}
