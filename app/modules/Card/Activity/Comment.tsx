import PrimaryButton from "@/app/common/components/PrimaryButton";
import { timeSince } from "@/app/common/utils/utils";
import useComment from "@/app/services/Comment/useComment";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { UserType } from "@/app/types";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Box, IconTrash, Stack, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";

import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useQuery } from "react-query";
import styled from "styled-components";
import { fadeVariant } from "../Utils/variants";

export const TextArea = styled(ContentEditable)<{ mode: string }>`
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  border-width: 2px;
  border-style: solid;
  border-color: ${(props) =>
    props.mode === "dark"
      ? "rgb(255, 255, 255, 0.02)"
      : "rgb(20, 20, 20, 0.2)"};

  background: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(247, 247, 247)"};
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
    content: "Add a comment...";
    color: ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.7)"
        : "rgb(20, 20, 20, 0.7)"};
  }
`;

interface Props {
  newComment: boolean;
  actorId?: string;
  commentContent?: string;
  commitId?: string;
  timestamp?: string;
}

export default function Comment({
  newComment,
  actorId,
  commentContent,
  commitId,
  timestamp,
}: Props) {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [content, setContent] = useState("");
  const { addComment, updateComment, deleteComment, loading } = useComment();
  const { getMemberDetails } = useModalOptions();
  const { mode } = useTheme();
  useEffect(() => {
    if (commentContent) {
      setContent(commentContent);
    }
    if (newComment) {
      setIsDisabled(false);
    }
  }, [newComment, commentContent]);

  return (
    <motion.main
      variants={fadeVariant}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
      className=""
      key="editor"
    >
      <Stack space="1">
        <Stack direction="horizontal" align="center">
          {newComment ? (
            <Avatar
              label=""
              placeholder={!currentUser?.avatar}
              src={currentUser?.avatar}
              address={currentUser?.ethAddress}
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
          {/* <TextArea contentEditable role="textbox" /> */}
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
            mode={mode}
          />
        </Stack>
        <AnimatePresence>
          {newComment && content.length > 0 && (
            <Box marginLeft="12" width="1/3" marginTop="1">
              <PrimaryButton
                icon={<SendOutlined />}
                loading={loading}
                animation="slide"
                onClick={() => {
                  void addComment(content);
                  setContent("");
                }}
              >
                Send
              </PrimaryButton>
            </Box>
          )}
        </AnimatePresence>
        {!newComment && timestamp && (
          <Box marginLeft="12">
            <Text variant="label">
              Posted {timeSince(new Date(timestamp))} ago
            </Text>
          </Box>
        )}
        <AnimatePresence>
          {!newComment && !isDisabled && (
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
              <Stack direction="horizontal">
                <Box marginLeft="12" width="1/3">
                  <PrimaryButton
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={async () => {
                      const res = await updateComment(
                        content,
                        commitId as string
                      );
                      if (res) {
                        setIsDisabled(true);
                      }
                    }}
                  >
                    Save
                  </PrimaryButton>
                </Box>
                <Box width="1/3">
                  <PrimaryButton
                    tone="red"
                    icon={<IconTrash />}
                    onClick={() => {
                      void deleteComment(commitId as string);
                      setContent("");
                      setIsDisabled(true);
                    }}
                  >
                    Delete
                  </PrimaryButton>
                </Box>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </motion.main>
  );
}
