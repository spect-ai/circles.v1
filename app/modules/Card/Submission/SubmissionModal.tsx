import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import useSubmission from "@/app/services/Submission/useSubmission";
import { SendOutlined } from "@ant-design/icons";
import { Box, Button, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";

const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

export default function SubmissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createWorkThread, loading } = useSubmission();
  return (
    <>
      <Button size="small" variant="secondary" onClick={() => setIsOpen(true)}>
        Create Submission
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Create Submission">
            <Box padding="8">
              <Stack>
                <NameInput
                  placeholder="Submission Title"
                  autoFocus
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <Box
                  style={{
                    minHeight: "10rem",
                    maxHeight: "20rem",
                    overflowY: "auto",
                  }}
                  marginTop="2"
                >
                  <Editor
                    value={content}
                    onChange={(txt) => {
                      setContent(txt);
                    }}
                    placeholder="Write your submission here"
                  />
                </Box>
                <Button
                  size="small"
                  variant="secondary"
                  loading={loading}
                  prefix={<SendOutlined style={{ fontSize: "1.2rem" }} />}
                  onClick={async () => {
                    const res = await createWorkThread({
                      name: title,
                      content: content,
                      status: "draft",
                    });
                    res && setIsOpen(false);
                  }}
                >
                  Send
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}