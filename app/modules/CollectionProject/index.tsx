import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Text } from "degen";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import ProjectHeading from "./Heading";
import KanbanView from "./KanbanView";
import ListView from "./ListView";
import ProjectTableView from "./TableView";

const CollectionProject = () => {
  const { projectViewId, localCollection: collection } = useLocalCollection();
  const { formActions } = useRoleGate();
  return (
    <Box>
      <ProjectHeading />
      {formActions("viewResponses") && (
        <Box>
          {collection.projectMetadata.views[projectViewId]?.type === "grid" && (
            <ProjectTableView />
          )}
          {collection.projectMetadata.views[projectViewId]?.type ===
            "kanban" && <KanbanView />}
          {collection.projectMetadata.views[projectViewId]?.type === "list" && (
            <ListView />
          )}
        </Box>
      )}
      {!formActions("viewResponses") && (
        <Box width="full" marginTop="32">
          <Stack align="center" justify="center">
            <Text color="text" weight="semiBold" size="headingTwo">
              You do not have permission to view this collection.
            </Text>
            <Text color="text" size="large">
              Ask the creator to update the access roles of this collection
            </Text>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default CollectionProject;
