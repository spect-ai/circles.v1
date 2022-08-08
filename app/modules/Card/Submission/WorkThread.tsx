import Accordian from "@/app/common/components/Accordian";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { WorkThreadType } from "@/app/types";
import { Box } from "degen";
import EditorSubmission from "./EditorSubmission";
import Revision from "./Revision";
import WorkUnit from "./WorkUnit";

type Props = {
  workThread: WorkThreadType;
};

export default function WorkThread({ workThread }: Props) {
  const { canTakeAction } = useRoleGate();
  return (
    <Box>
      <Accordian name={workThread.name} defaultOpen>
        {workThread.workUnitOrder.map((workUnitId) => {
          return (
            <WorkUnit
              key={workUnitId}
              workUnit={workThread.workUnits[workUnitId]}
              workThread={workThread}
              status={workThread.status}
            />
          );
        })}
        {canTakeAction("cardRevision") && (
          <Revision newRevision workThreadId={workThread.threadId} />
        )}
        {canTakeAction("cardSubmission") &&
          workThread.status === "inRevision" && (
            <EditorSubmission isDisabled={false} workThread={workThread} />
          )}
      </Accordian>
    </Box>
  );
}
