import Accordian from "@/app/common/components/Accordian";
import { Box, Stack } from "degen";
import React from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import NewSubTask from "./NewSubTask";
import CreatedSubTask from "./CreatedSubTask";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

export default function SubTasks() {
  const { childrenTasks } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  return (
    <Box>
      <Accordian
        name={`Sub Tasks (${childrenTasks?.length || 0})`}
        defaultOpen={childrenTasks.length === 0}
      >
        <Box overflow="hidden">
          <Stack space="2">
            {canTakeAction("cardSubTask") && <NewSubTask />}
            {childrenTasks?.map((child, index) => (
              <CreatedSubTask child={child} key={index} />
            ))}
          </Stack>
        </Box>
      </Accordian>
    </Box>
  );
}
