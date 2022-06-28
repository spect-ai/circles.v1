import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useApplication from "@/app/services/Apply/useApplication";
import { SendOutlined } from "@ant-design/icons";
import { Box, IconUserSolid, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { applicationTemplate } from "./template";

export default function Apply() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(applicationTemplate);
  const { createApplication, loading } = useApplication();
  return (
    <>
      <PrimaryButton icon={<IconUserSolid />} onClick={() => setIsOpen(true)}>
        Apply
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Create Application"
            size="large"
            height="40rem"
          >
            <Box padding="8">
              <Stack>
                <Box
                  style={{
                    height: "27rem",
                    overflowY: "auto",
                  }}
                  marginTop="2"
                >
                  <Editor
                    value={content}
                    onChange={(txt) => {
                      setContent(txt);
                    }}
                    placeholder="Write your application here"
                  />
                </Box>
                <PrimaryButton
                  loading={loading}
                  icon={<SendOutlined style={{ fontSize: "1.2rem" }} />}
                  onClick={async () => {
                    const res = await createApplication({
                      content,
                    });
                    res && setIsOpen(false);
                  }}
                >
                  Send
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
