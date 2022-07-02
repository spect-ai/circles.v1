import Accordian from "@/app/common/components/Accordian";
import { Box, Stack } from "degen";
import React from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import NewSubTask from "./NewSubTask";
import CreatedSubTask from "./CreatedSubTask";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import CacheSubTask from "./CacheSubTask";

type Props = {
  createCard: boolean;
};

export default function SubTasks({ createCard }: Props) {
  const { childrenTasks, subTasks } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  return (
    <Box>
      <Accordian
        name={`Sub Tasks (${
          createCard ? subTasks.length : childrenTasks?.length || 0
        })`}
        defaultOpen={childrenTasks.length === 0}
      >
        <Box overflow="hidden">
          <Stack space="2">
            {canTakeAction("cardSubTask") && (
              <NewSubTask createCard={createCard} />
            )}
            {!createCard &&
              childrenTasks?.map((child, index) => (
                <CreatedSubTask child={child} key={index} />
              ))}
            {createCard &&
              subTasks?.map((child, index) => (
                <CacheSubTask child={child} key={index} />
              ))}
          </Stack>
        </Box>
      </Accordian>
    </Box>
  );
}
