import PrimaryButton from "@/app/common/components/PrimaryButton";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useSubmission from "@/app/services/Submission/useSubmission";
import { UserType } from "@/app/types";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useQuery } from "react-query";
import styled from "styled-components";

export const TextArea = styled(ContentEditable)`
  color: rgb(255, 255, 255, 0.85);
  border: 2px solid rgb(255, 255, 255, 0.1);
  background: ${(props) =>
    props.disabled ? "rgb(255, 255, 255, 0)" : "rgb(20,20,20)"};
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  resize: none;
  min-height: 40px;
  line-height: 20px;
  outline: none;
  padding: 1rem;
  &:focus {
    border: 2px solid rgb(191, 90, 242, 1);
  }
  &:hover {
    border: 2px solid rgb(191, 90, 242, 1);
  }
  transition: all 0.2s ease-in-out;

  :empty::before {
    content: "Add comments/ revision instructions";
    color: rgb(255, 255, 255, 0.25);
  }
`;

interface Props {
  newRevision: boolean;
  actorId?: string;
  revisionContent?: string;
  workUnitId?: string;
  workThreadId?: string;
}

export default function Revision({
  newRevision,
  actorId,
  revisionContent,
  workUnitId,
  workThreadId,
}: Props) {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { getMemberDetails } = useModalOptions();
  const [content, setContent] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const { createWorkUnit, loading } = useSubmission();

  useEffect(() => {
    if (revisionContent) {
      setContent(revisionContent);
    }
    if (newRevision) {
      setIsDisabled(false);
    }
  }, [revisionContent, newRevision]);

  return (
    <Box marginBottom="4">
      <Stack space="1">
        <Stack direction="horizontal" align="center">
          {/* <TextArea contentEditable role="textbox" /> */}
          <Box marginLeft="8" />
          <TextArea
            html={content}
            onChange={(evt) => {
              setContent(evt.target.value);
            }}
            disabled={isDisabled}
            onClick={() => {
              if (actorId === currentUser?.id) {
                setIsDisabled(false);
              }
            }}
          />
          {newRevision ? (
            <Avatar
              label=""
              placeholder={!currentUser?.avatar}
              src={currentUser?.avatar}
              size="8"
            />
          ) : (
            <Avatar
              label=""
              placeholder={!getMemberDetails(actorId as string)?.avatar}
              src={getMemberDetails(actorId as string)?.avatar}
              size="8"
            />
          )}
        </Stack>
        <AnimatePresence>
          {newRevision && content.length > 0 && (
            <Box marginLeft="12" width="1/3" marginTop="2">
              <PrimaryButton
                icon={<SendOutlined />}
                loading={loading}
                onClick={() => {
                  void createWorkUnit(
                    {
                      content,
                      type: "revision",
                      status: "inRevision",
                    },
                    workThreadId as string
                  );
                  setContent("");
                }}
              >
                Send
              </PrimaryButton>
            </Box>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
