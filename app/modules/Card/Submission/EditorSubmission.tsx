import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useSubmission from "@/app/services/Submission/useSubmission";
import { WorkThreadType, WorkUnitType } from "@/app/types";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  workThread?: WorkThreadType;
  workUnit?: WorkUnitType;
  isDisabled: boolean;
};

export default function EditorSubmission({
  workUnit,
  isDisabled,
  workThread,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  const { canTakeAction } = useRoleGate();
  const { createWorkUnit, updateWorkUnit } = useSubmission();
  const [content, setContent] = useState(workUnit?.content || "");
  const { connectedUser } = useGlobal();
  const [canSave, setCanSave] = useState(false);

  const savebuttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Box
      style={{
        minHeight: "5rem",
      }}
      marginRight="2"
      marginBottom="4"
    >
      <Box marginBottom="2">
        <Link href={workUnit?.pr as string}>{workUnit?.pr}</Link>
      </Box>
      <Stack direction="horizontal" space="6">
        {workUnit ? (
          <Avatar
            src={getMemberDetails(workUnit.user)?.avatar}
            label=""
            size="8"
            placeholder={!getMemberDetails(workUnit.user)?.avatar}
          />
        ) : (
          <Avatar
            src={getMemberDetails(connectedUser)?.avatar}
            label=""
            size="8"
            placeholder={!getMemberDetails(connectedUser)?.avatar}
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
          placeholder="Add a submission, press '/' for commands"
          disabled={!canTakeAction("cardSubmission") || isDisabled}
        />
      </Stack>
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
            style={{ width: "25%", marginTop: "0.5rem", paddingLeft: "0.3rem" }}
          >
            <Stack direction="horizontal">
              {workUnit && (
                <Button
                  ref={savebuttonRef}
                  prefix={<SaveOutlined />}
                  size="small"
                  variant="transparent"
                  disabled={!content}
                  onClick={() => {
                    void updateWorkUnit(
                      {
                        type: "submission",
                        content,
                        status: workThread?.status,
                      },
                      workThread?.threadId as string,
                      workUnit?.workUnitId
                    );
                  }}
                >
                  Save
                </Button>
              )}
              {workUnit && workThread?.status === "draft" && (
                <Button
                  ref={savebuttonRef}
                  prefix={<SendOutlined />}
                  size="small"
                  variant="secondary"
                  disabled={!content}
                  onClick={() => {
                    void updateWorkUnit(
                      {
                        type: "submission",
                        content,
                        status: "inReview",
                      },
                      workThread?.threadId,
                      workUnit?.workUnitId
                    );
                  }}
                >
                  Save and Send
                </Button>
              )}
            </Stack>
            {!workUnit && (
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
                    workThread?.threadId as string
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
