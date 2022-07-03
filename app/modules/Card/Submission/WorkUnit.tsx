import { WorkThreadType, WorkUnitType } from "@/app/types";
import Revision from "./Revision";
import EditorSubmission from "./EditorSubmission";

type Props = {
  workUnit: WorkUnitType;
  workThread: WorkThreadType;
  status: "accepted" | "inRevision" | "inReview" | "draft";
};

export default function WorkUnit({ workUnit, workThread, status }: Props) {
  return (
    <>
      {workUnit.type === "submission" && (
        <EditorSubmission
          workUnit={workUnit}
          workThread={workThread}
          isDisabled={status !== "draft"}
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
