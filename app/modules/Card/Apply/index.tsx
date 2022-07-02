import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useApplication from "@/app/services/Apply/useApplication";
import { SendOutlined } from "@ant-design/icons";
import { Box, IconUserSolid, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
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

export default function Apply() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const { createApplication, loading } = useApplication();

  const [title, setTitle] = useState("");
  return (
    <>
      <PrimaryButton icon={<IconUserSolid />} onClick={() => setIsOpen(true)}>
        Apply
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal handleClose={() => setIsOpen(false)} title="Create Submission">
            <Box padding="8">
              <Stack>
                <NameInput
                  placeholder="Application Title"
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
                    placeholder="Tell us about your application"
                  />
                </Box>
                <Stack direction="horizontal">
                  <Box width="full">
                    <PrimaryButton
                      loading={loading}
                      icon={<SendOutlined style={{ fontSize: "1.2rem" }} />}
                      onClick={async () => {
                        const res = await createApplication({
                          title,
                          content,
                        });
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
        )}
      </AnimatePresence>
    </>
  );
}
