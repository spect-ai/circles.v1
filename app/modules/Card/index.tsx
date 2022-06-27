import Accordian from "@/app/common/components/Accordian";
import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconTrash, Stack, Tag } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import EditableSubTask from "../Project/CreateCardModal/EditableSubTask";
import { useLocalCard } from "../Project/CreateCardModal/hooks/LocalCardContext";
import CardAssignee from "../Project/CreateCardModal/modals/CardAssignee";
import CardColumn from "../Project/CreateCardModal/modals/CardColumn";
import CardDeadline from "../Project/CreateCardModal/modals/CardDeadline";
import CardLabels from "../Project/CreateCardModal/modals/CardLabels";
import CardPriority from "../Project/CreateCardModal/modals/CardPriority";
import CardReviewer from "../Project/CreateCardModal/modals/CardReviewer";
import CardReward from "../Project/CreateCardModal/modals/CardReward";
import CardType from "../Project/CreateCardModal/modals/CardType";
import Activity from "./Activity";
import CreateSubTask from "./CreateSubTask";
import Payment from "./Payment";
import Submission from "./Submission";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 80vh;
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
  caret-color: rgb(255, 255, 255, 0.85);
  color: rgb(255, 255, 255, 0.85);
  font-weight: 600;
`;

export const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: {
    opacity: 0,
    x: 0,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export default function Card() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabClick = (index: number) => setSelectedTab(index);
  const {
    loading,
    title,
    setTitle,
    labels,
    subTasks,
    description,
    setDescription,
    project,
    onArchive,
    onCardUpdate,
  } = useLocalCard();

  const { canTakeAction } = useRoleGate();

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box padding="4">
      <ToastContainer />
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to archive this task?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onArchive();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
      {loading && <Loader loading={loading} text="" />}
      {!loading && (
        <Stack direction="horizontal">
          <Box width="3/4">
            <Container padding="2">
              <Stack direction="vertical">
                <NameInput
                  placeholder="Card name"
                  value={title}
                  disabled={!canTakeAction("cardTitle")}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onBlur={() => {
                    onCardUpdate();
                  }}
                />
                <Stack direction="horizontal" wrap>
                  <CardLabels />
                  {labels.map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </Stack>
                <Accordian
                  name={`Sub Tasks (${subTasks?.length || 0})`}
                  defaultOpen={subTasks.length === 0}
                  // buttonComponent={<CreateSubTask />}
                  // showButton={canTakeAction("cardSubTask")}
                >
                  <Stack>
                    <EditableSubTask newSubTask />
                    {subTasks?.map((subTask, index) => (
                      <EditableSubTask subTaskIndex={index} key={index} />
                    ))}
                  </Stack>
                </Accordian>
                <Box
                  style={{
                    minHeight: "10rem",
                    maxHeight: "25rem",
                    overflowY: "auto",
                  }}
                  marginRight="4"
                  paddingLeft="4"
                >
                  {!loading && (
                    <Editor
                      value={description}
                      onChange={(txt) => {
                        setDescription(txt);
                      }}
                      placeholder="Describe your card"
                      disabled={!canTakeAction("cardDescription")}
                      onBlur={() => {
                        onCardUpdate();
                      }}
                    />
                  )}
                </Box>
                <Tabs
                  tabs={["Activity", "Submissions"]}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                  orientation="horizontal"
                  unselectedColor="transparent"
                  shape="circle"
                />
                <AnimatePresence initial={false}>
                  {selectedTab === 0 && <Activity />}
                  {selectedTab === 1 && !loading && <Submission />}
                </AnimatePresence>
              </Stack>
            </Container>
          </Box>
          <Box width="1/4" borderLeftWidth="0.375" paddingLeft="4">
            {project?.id && (
              <Stack>
                <CardType />
                <CardColumn />
                <CardAssignee />
                <CardReviewer />
                <CardDeadline />
                <CardPriority />
                <CardReward />
                {canTakeAction("cardArchive") && (
                  <PrimaryButton
                    icon={<IconTrash />}
                    tone="red"
                    onClick={() => setShowConfirm(true)}
                  >
                    Archive
                  </PrimaryButton>
                )}
                {/* <DiscordThread /> */}
                <Payment />
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
