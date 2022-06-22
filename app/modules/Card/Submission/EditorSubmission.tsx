import Editor from "@/app/common/components/Editor";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useSubmission from "@/app/services/Submission/useSubmission";
import { UserType, WorkUnitType } from "@/app/types";
import { SaveOutlined } from "@ant-design/icons";
import { Avatar, Box, Button } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";

type Props = {
  workThreadId?: string;
  workUnit?: WorkUnitType;
  isDisabled: boolean;
};

export default function EditorSubmission({
  workUnit,
  isDisabled,
  workThreadId,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  const { canTakeAction } = useRoleGate();
  const { createWorkUnit, updateWorkUnit } = useSubmission();
  const [content, setContent] = useState(workUnit?.content || "");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  return (
    <Box
      style={{
        minHeight: "10rem",
      }}
      marginRight="2"
      paddingLeft="4"
      marginBottom="4"
    >
      {workUnit ? (
        <Avatar
          src={getMemberDetails(workUnit.user)?.avatar}
          label=""
          size="8"
          placeholder={!getMemberDetails(workUnit.user)?.avatar}
        />
      ) : (
        <Avatar
          src={getMemberDetails(currentUser?.id as string)?.avatar}
          label=""
          size="8"
          placeholder={!getMemberDetails(currentUser?.id as string)?.avatar}
        />
      )}
      <Editor
        value={content}
        onChange={(txt) => {
          setContent(txt);
        }}
        placeholder="Add your submission"
        disabled={!canTakeAction("cardSubmission") || isDisabled}
      />
      <AnimatePresence>
        {canTakeAction("cardSubmission") && !isDisabled && (
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
                void createWorkUnit(
                  {
                    content,
                    type: "submission",
                    status: "inReview",
                  },
                  workThreadId as string
                );
                setContent("");
                // void updateWorkUnit(
                //   {
                //     type: "submission",
                //     content,
                //   },
                //   workThreadId,
                //   workUnit?.workUnitId as string
                // );
              }}
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
