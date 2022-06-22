import { WorkUnitType } from "@/app/types";
import Revision from "./Revision";
import EditorSubmission from "./EditorSubmission";

type Props = {
  workUnit: WorkUnitType;
  workThreadId: string;
  status: "accepted" | "inRevision" | "inReview" | "draft";
  workUnitOrder: string[];
};

export default function WorkUnit({
  workUnit,
  workThreadId,
  status,
  workUnitOrder,
}: Props) {
  return (
    <>
      {workUnit.type === "submission" && (
        <EditorSubmission
          workUnit={workUnit}
          workThreadId={workThreadId}
          isDisabled={
            status !== "draft" &&
            workUnitOrder[workUnitOrder.length - 1] !== workUnit.workUnitId
          }
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
