import Accordian from "@/app/common/components/Accordian";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack } from "degen";
import React from "react";
import EditableSubTask from "../../Project/CreateCardModal/EditableSubTask";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import CreateSubTask from "../CreateSubTask";

export default function SubTasks() {
  const { subTasks } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  return (
    <Box>
      <Accordian
        name={`Sub Tasks (${subTasks?.length || 0})`}
        defaultOpen={subTasks.length === 0}
        // buttonComponent={<CreateSubTask />}
        // showButton={canTakeAction("cardSubTask")}
      >
        <Stack>
          <EditableSubTask newSubTask />
          {subTasks?.map((subTask, index) => (
            <EditableSubTask subTaskIndex={index} key={index} />
          ))}
        </Stack>
      </Accordian>
    </Box>
  );
}
