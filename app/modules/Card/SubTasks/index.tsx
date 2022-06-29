import Accordian from "@/app/common/components/Accordian";
import { Box, Stack } from "degen";
import React from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import NewSubTask from "./NewSubTask";
import CreatedSubTask from "./CreatedSubTask";

export default function SubTasks() {
  const { childrenTasks } = useLocalCard();
  return (
    <Box>
      <Accordian
        name={`Sub Tasks (${childrenTasks?.length || 0})`}
        defaultOpen={childrenTasks.length === 0}
      >
        <Box overflow="hidden">
          <Stack space="2">
            <NewSubTask />
            {childrenTasks?.map((child, index) => (
              <CreatedSubTask child={child} key={index} />
            ))}
          </Stack>
        </Box>
      </Accordian>
    </Box>
  );
}
