import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { createApplicationFetch } from "@/app/services/Apply";
import useApplication from "@/app/services/Apply/useApplication";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { SendOutlined } from "@ant-design/icons";
import { Box, Stack } from "degen";
import { useState } from "react";
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

export default function Apply({ cardId, setIsOpen }: Props) {
  const [content, setContent] = useState("");
  const { loading } = useApplication();

  const [title, setTitle] = useState("");

  const { fetchMemberDetails } = useModalOptions();

  const { setCard } = useLocalCard();
  return (
    <Modal handleClose={() => setIsOpen(false)} title="Create Application">
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
              placeholder="Add an application, press '/' for commands"
            />
          </Box>
          <Stack direction="horizontal">
            <Box width="full">
              <PrimaryButton
                disabled={!title || !content}
                loading={loading}
                icon={<SendOutlined style={{ fontSize: "1.2rem" }} />}
                onClick={async () => {
                  const res = await createApplicationFetch(
                    cardId,
                    {
                      title,
                      content,
                    },
                    setCard
                  );
                  fetchMemberDetails();
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
