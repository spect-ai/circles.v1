import Accordian from "@/app/common/components/Accordian";
import { timeSince } from "@/app/common/utils/utils";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { WorkThreadType } from "@/app/types";
import { Box, Text } from "degen";
import React from "react";
import Revision from "./Revision";
import WorkUnit from "./WorkUnit";

type Props = {
  workThread: WorkThreadType;
};

export default function WorkThread({ workThread }: Props) {
  const { canTakeAction } = useRoleGate();
  return (
    <Box>
      <Accordian
        name={workThread.name}
        defaultOpen
        buttonComponent={
          <Box width="1/2">
            <Text variant="small" size="extraSmall">
              {" Updated " + timeSince(new Date(workThread.updatedAt)) + " ago"}
            </Text>
          </Box>
        }
      >
        {workThread.workUnitOrder.map((workUnitId) => (
          <WorkUnit
            key={workUnitId}
            workUnit={workThread.workUnits[workUnitId]}
            workThreadId={workThread.threadId}
          />
        ))}
        {canTakeAction("cardRevision") && (
          <Revision newRevision workThreadId={workThread.threadId} />
        )}
      </Accordian>
    </Box>
  );
}
