import { WorkThreadType } from "@/app/types";
import { Box } from "degen";
import React from "react";
import WorkUnit from "./WorkUnit";

type Props = {
  workThread: WorkThreadType;
  threadId: string;
};

export default function WorkThread({ workThread, threadId }: Props) {
  return (
    <Box>
      {workThread.workUnitOrder.map((workUnitId) => (
        <WorkUnit
          key={workUnitId}
          workUnit={workThread.workUnits[workUnitId]}
          workThreadId={threadId}
          workUnitId={workUnitId}
        />
      ))}
    </Box>
  );
}
