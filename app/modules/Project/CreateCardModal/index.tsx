import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import {
  Box,
  Button,
  IconCheck,
  IconPlus,
  IconPlusSmall,
  Stack,
  Tag,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditableSubTask from "./EditableSubTask";
import {
  CreateCardContext,
  useProviderCreateCard,
} from "./hooks/createCardContext";
import CardAssignee from "./modals/CardAssignee";
import CardColumn from "./modals/CardColumn";
import CardDeadline from "./modals/CardDeadline";
import CardLabels from "./modals/CardLabels";
import CardType from "./modals/CardType";

type Props = {
  column: string;
  handleClose: () => void;
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

export default function CreateCardModal({ column, handleClose }: Props) {
  const context = useProviderCreateCard({ handleClose });
  const {
    columnId,
    cardType,
    assignee,
    deadline,
    setColumnId,
    value,
    token,
    onSubmit,
    title,
    setTitle,
    loading,
    labels,
    subTasks,
    setSubTasks,
    submission,
    setSubmission,
  } = context;

  useEffect(() => {
    console.log({ column });
    setColumnId(column);
  }, []);
  return (
    <CreateCardContext.Provider value={context}>
      <Modal size="large" title="Create Card" handleClose={handleClose}>
        <Container height="full" padding="8" width="full">
          <Stack direction="vertical">
            {/* <Heading>{task.title}</Heading> */}
            <NameInput
              placeholder="Enter card name"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Stack direction="horizontal" wrap>
              <CardType />
              <CardColumn />
              <CardAssignee />
              <CardDeadline />
            </Stack>
            <Stack direction="horizontal" wrap>
              <CardLabels />
              {labels.map((label) => (
                <Tag key={label}>{label}</Tag>
              ))}
            </Stack>
            <Stack direction="horizontal" align="center">
              <Button
                size="small"
                shape="circle"
                variant="secondary"
                onClick={() => {
                  setSubTasks([...subTasks, { title: "", assignee: "" }]);
                }}
              >
                <IconPlus />
              </Button>
              <Text variant="label">Add Subtasks</Text>
            </Stack>
            {subTasks?.map((subTask, index) => (
              <EditableSubTask subTaskIndex={index} key={index} />
            ))}
            <Box style={{ minHeight: "10rem" }} marginTop="2">
              <Editor
                value={submission}
                onChange={(txt) => {
                  setSubmission(txt);
                }}
              />
            </Box>
          </Stack>
        </Container>
        <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
          <Button size="small" width="1/3" onClick={onSubmit}>
            Create Card
          </Button>
        </Box>
      </Modal>
    </CreateCardContext.Provider>
  );
}
