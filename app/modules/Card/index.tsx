import Accordian from "@/app/common/components/Accordian";
import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { SaveOutlined } from "@ant-design/icons";
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
    onCardUpdate,
    isDirty,
    setIsDirty,
    onArchive,
  } = useLocalCard();

  const { canTakeAction } = useRoleGate();

  return (
    <Box padding="4">
      <ToastContainer />
      {loading && <Loader loading={loading} text="" />}
      {!loading && (
        <Stack direction="horizontal">
          <Box width="3/4">
            <Container padding="2">
              <Stack direction="vertical">
                <NameInput
                  placeholder="Enter card name"
                  value={title}
                  disabled={!canTakeAction("cardTitle")}
                  onChange={(e) => {
                    setTitle(e.target.value);
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
                  defaultOpen={false}
                >
                  <Stack>
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
                        setIsDirty(true);
                        setDescription(txt);
                      }}
                      placeholder="Describe your card"
                      disabled={!canTakeAction("cardDescription")}
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
                {isDirty && (
                  <PrimaryButton
                    icon={<SaveOutlined style={{ fontSize: "1.3rem" }} />}
                    loading={loading}
                    onClick={() => {
                      onCardUpdate();
                    }}
                    animation="slide"
                  >
                    Save
                  </PrimaryButton>
                )}
                {canTakeAction("cardArchive") && (
                  <PrimaryButton
                    icon={<IconTrash />}
                    tone="red"
                    onClick={() => onArchive()}
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
