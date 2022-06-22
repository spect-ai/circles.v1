import Editor from "@/app/common/components/Editor";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { WorkUnitType } from "@/app/types";
import { Avatar, Box, Button } from "degen";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SaveOutlined } from "@ant-design/icons";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useSubmission from "@/app/services/Submission/useSubmission";
import Revision from "./Revision";

type Props = {
  workUnit: WorkUnitType;
  workThreadId: string;
};

export default function WorkUnit({ workUnit, workThreadId }: Props) {
  const [content, setContent] = useState(workUnit.content);
  const [showSave, setShowSave] = useState(false);
  const { getMemberDetails } = useModalOptions();
  const { updateWorkUnit } = useSubmission();
  const { canTakeAction } = useRoleGate();
  return (
    <>
      {workUnit.type === "submission" && (
        <Box
          style={{
            minHeight: "10rem",
          }}
          marginRight="2"
          paddingLeft="4"
          marginBottom="4"
        >
          <Avatar
            src={getMemberDetails(workUnit.user)?.avatar}
            label=""
            size="8"
            placeholder={!getMemberDetails(workUnit.user)?.avatar}
          />
          <Editor
            value={content}
            onChange={(txt) => {
              setShowSave(true);
              setContent(txt);
            }}
            placeholder="Add your submission"
            disabled={!canTakeAction("cardSubmission")}
          />
          <AnimatePresence>
            {canTakeAction("cardSubmission") && showSave && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { height: "2rem", opacity: 1 },
                  collapsed: { height: 0, opacity: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  prefix={<SaveOutlined />}
                  size="small"
                  variant="secondary"
                  disabled={!content}
                  onClick={() => {
                    void updateWorkUnit(
                      {
                        type: "submission",
                        content,
                      },
                      workThreadId,
                      workUnit.workUnitId
                    );
                  }}
                >
                  Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
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
