import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useSubmission from "@/app/services/Submission/useSubmission";
import { UserType, WorkUnitType } from "@/app/types";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
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
  const [canSave, setCanSave] = useState(false);

  const savebuttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Box
      style={{
        minHeight: "5rem",
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
          setCanSave(true);
          savebuttonRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }}
        placeholder="Add your submission"
        disabled={!canTakeAction("cardSubmission") || isDisabled}
      />
      <AnimatePresence>
        {canTakeAction("cardSubmission") && !isDisabled && canSave && (
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
            {workUnit ? (
              <Button
                ref={savebuttonRef}
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
                    workThreadId as string,
                    workUnit?.workUnitId
                  );
                }}
              >
                Save
              </Button>
            ) : (
              <PrimaryButton
                icon={<SendOutlined />}
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
                }}
              >
                Send
              </PrimaryButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
