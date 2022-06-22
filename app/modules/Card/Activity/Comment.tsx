import { timeSince } from "@/app/common/utils/utils";
import useComment from "@/app/services/Comment/useComment";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { UserType } from "@/app/types";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";

import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useQuery } from "react-query";
import styled from "styled-components";
import { variants } from "..";

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
    border: 2px solid rgb(175, 82, 222, 1);
  }
  &:hover {
    border: 2px solid rgb(175, 82, 222, 1);
  }
  transition: all 0.2s ease-in-out;

  :empty::before {
    content: "Add a comment...";
    color: rgb(255, 255, 255, 0.25);
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
      variants={variants}
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
          />
        </Stack>
        <AnimatePresence>
          {newComment && content.length > 0 && (
            <Box marginLeft="12">
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
                  size="small"
                  variant="secondary"
                  loading={loading}
                  onClick={() => {
                    void addComment(content);
                    setContent("");
                    setIsDisabled(true);
                  }}
                >
                  Save
                </Button>
              </motion.div>
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
                <Box marginLeft="12">
                  <Button
                    size="small"
                    variant="secondary"
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
                  </Button>
                </Box>
                <Button
                  size="small"
                  variant="secondary"
                  tone="red"
                  onClick={() => {
                    void deleteComment(commitId as string);
                    setContent("");
                    setIsDisabled(true);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </motion.main>
  );
}
