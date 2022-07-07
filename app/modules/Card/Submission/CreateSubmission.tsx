import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { createWorkThreadFetch } from "@/app/services/Submission";
import useSubmission from "@/app/services/Submission/useSubmission";
import { SendOutlined } from "@ant-design/icons";
import { Box, Stack } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

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

interface Props {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

export default function CreateSubmission({ cardId, setIsOpen }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { loading } = useSubmission();
  const { setCard } = useLocalCard();
  return (
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
              placeholder="Add submission here"
            />
          </Box>
          <Stack direction="horizontal">
            {/* <Box width="full">
                    <PrimaryButton
                      loading={loading}
                      icon={<IconDocuments />}
                      onClick={async () => {
                        const res = await createWorkThread({
                          name: title,
                          content: content,
                          status: "draft",
                        });
                        res && setIsOpen(false);
                      }}
                    >
                      Save as Draft
                    </PrimaryButton>
                  </Box> */}
            <Box width="full">
              <PrimaryButton
                disabled={!title || !content}
                loading={loading}
                icon={<SendOutlined style={{ fontSize: "1.2rem" }} />}
                onClick={async () => {
                  const res = await createWorkThreadFetch(
                    cardId,
                    {
                      name: title,
                      content: content,
                      status: "inReview",
                    },
                    setCard
                  );
                  res && setIsOpen(false);
                }}
              >
                Send
              </PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
