import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { Box, Button, Stack, Tag } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CardAssignee from "../../Card/modals/CardAssignee";
import CardColumn from "../../Card/modals/CardColumn";
import CardDeadline from "../../Card/modals/CardDeadline";
import CardStartDate from "../../Card/modals/CardStartDate";
import CardLabels from "../../Card/modals/CardLabels";
import CardType from "../../Card/modals/CardType";
import CardReward from "../../Card/modals/CardReward";
import CardPriority from "../../Card/modals/CardPriority";
import {
  LocalCardContext,
  useProviderLocalCard,
} from "./hooks/LocalCardContext";
import { ProjectType } from "@/app/types";
import CardReviewer from "../../Card/modals/CardReviewer";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import SubTasks from "../../Card/SubTasks";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  column: string;
  setIsDirty: (isDirty: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (showConfirm: boolean) => void;
  handleClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 60vh;
  overflow-y: auto;
`;

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

export default function CreateCardModal({
  column,
  setIsDirty,
  showConfirm,
  setShowConfirm,
  handleClose,
  setIsOpen,
}: Props) {
  const closeModal = () => setIsOpen(false);
  const context = useProviderLocalCard({ handleClose: closeModal });
  const {
    setColumnId,
    onSubmit,
    title,
    setTitle,
    labels,
    setDescription,
    project,
  } = context;

  const [loading, setLoading] = useState(false);

  useHotkeys(
    "return",
    () => {
      void onSubmit(false);
      setIsDirty(false);
    },
    {
      enableOnTags: ["INPUT"] as any,
    }
  );

  useHotkeys(
    "shift+return",
    () => {
      void onSubmit(true);
      setIsDirty(false);
    },
    {
      enableOnTags: ["INPUT"] as any,
    }
  );

  useEffect(() => {
    setColumnId(column);
  }, [column, setColumnId]);

  return (
    <LocalCardContext.Provider value={context}>
      <Modal size="large" title="Create Card" handleClose={handleClose}>
        <AnimatePresence>
          {showConfirm && (
            <ConfirmModal
              title="Are you sure you want to discard the changes?"
              handleClose={() => setShowConfirm(false)}
              onConfirm={() => {
                setIsDirty(false);
                setShowConfirm(false);
                setTimeout(() => {
                  handleClose();
                }, 100);
              }}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </AnimatePresence>
        <Stack direction="horizontal">
          <Box width="2/3">
            <Container height="full" padding="8" width="full">
              <Stack direction="vertical">
                {/* <Heading>{task.title}</Heading> */}
                <NameInput
                  placeholder="Enter title"
                  autoFocus
                  value={title}
                  onChange={(e) => {
                    setIsDirty(true);
                    setTitle(e.target.value);
                  }}
                />

                <Stack direction="horizontal" wrap>
                  <CardLabels />
                  {labels.map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </Stack>
                <SubTasks createCard />
                <Box style={{ minHeight: "10rem" }} marginTop="2">
                  <div
                    key={`${
                      Object.keys(project?.cards as any).length
                    }-description`}
                  >
                    <Editor
                      placeholder="Add a description, press '/' for commands"
                      tourId="create-card-modal-description"
                      onChange={(txt) => {
                        setDescription(txt);
                      }}
                    />
                  </div>
                </Box>
              </Stack>
            </Container>
          </Box>
          <Box width="1/3" borderLeftWidth="0.375" padding="8">
            {(project as ProjectType)?.id && (
              <Stack>
                <CardType />
                <CardColumn />
                <CardAssignee />
                <CardReviewer />
                <CardStartDate />
                <CardDeadline />
                <CardPriority />
                <CardReward />
              </Stack>
            )}
          </Box>
        </Stack>
        <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
          <Stack direction="horizontal">
            <Button
              data-tour="create-card-modal-button"
              size="small"
              width="1/3"
              variant="secondary"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await onSubmit(false);
                setLoading(false);
                setIsDirty(false);
              }}
              disabled={!title}
            >
              Create Card
            </Button>
            <Button
              size="small"
              width="1/3"
              variant="tertiary"
              onClick={() => {
                void onSubmit(true);
                setIsDirty(false);
              }}
              disabled={!title}
            >
              Save and Create Another
            </Button>
          </Stack>
        </Box>
      </Modal>
    </LocalCardContext.Provider>
  );
}
