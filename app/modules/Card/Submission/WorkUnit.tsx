import { WorkUnitType } from "@/app/types";
import Revision from "./Revision";
import EditorSubmission from "./EditorSubmission";

type Props = {
  workUnit: WorkUnitType;
  workThreadId: string;
  nextWorkUnitType?: string;
};

export default function WorkUnit({
  workUnit,
  workThreadId,
  nextWorkUnitType,
}: Props) {
  return (
    <>
      {workUnit.type === "submission" && (
        <EditorSubmission
          workUnit={workUnit}
          workThreadId={workThreadId}
          isDisabled={nextWorkUnitType === "revision"}
        />
      )}
      {workUnit.type === "revision" && (
        <Revision
          newRevision={false}
          revisionContent={workUnit.content}
          actorId={workUnit.user}
        />
      )}
    </>
  );
}
