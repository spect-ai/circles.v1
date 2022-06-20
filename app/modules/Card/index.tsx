import Accordian from "@/app/common/components/Accordian";
import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import Tabs from "@/app/common/components/Tabs";
import {
  Box,
  Button,
  IconCheck,
  IconClose,
  Stack,
  Tag,
  Text,
  Textarea,
} from "degen";
import { motion, AnimatePresence } from "framer-motion";
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
import CardReward from "../Project/CreateCardModal/modals/CardReward";
import CardType from "../Project/CreateCardModal/modals/CardType";

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

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
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
    submission,
    setSubmission,
    project,
    onCardUpdate,
  } = useLocalCard();

  return (
    <Box padding="8">
      <ToastContainer />
      {loading && <Loader loading={loading} text="" />}
      {!loading && (
        <Stack direction="horizontal">
          <Box width="3/4">
            <Container>
              <Stack direction="vertical">
                <NameInput
                  placeholder="Enter card name"
                  value={title}
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
                  style={{ minHeight: "10rem" }}
                  marginRight="4"
                  paddingLeft="4"
                >
                  {!loading && (
                    <Editor
                      value={description}
                      onChange={(txt) => {
                        setDescription(txt);
                      }}
                    />
                  )}
                </Box>
                <Tabs
                  tabs={["Submissions", "Comments", "Activity"]}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                  orientation="horizontal"
                  unselectedColor="transparent"
                  border
                  shape="circle"
                />
                <AnimatePresence exitBeforeEnter>
                  {selectedTab === 0 && !loading && (
                    <motion.main
                      variants={variants} // Pass the variant object into Framer Motion
                      initial="hidden" // Set the initial state to variants.hidden
                      animate="enter" // Animated state to variants.enter
                      exit="exit" // Exit state (used later) to variants.exit
                      transition={{ type: "linear" }} // Set the transition to linear
                      className=""
                      key="editor"
                    >
                      <Editor
                        value={submission ? submission[0] : ""}
                        onChange={(txt) => {
                          setSubmission([txt]);
                        }}
                      />
                    </motion.main>
                  )}
                  {selectedTab === 1 && (
                    <motion.main
                      variants={variants} // Pass the variant object into Framer Motion
                      initial="hidden" // Set the initial state to variants.hidden
                      animate="enter" // Animated state to variants.enter
                      exit="exit" // Exit state (used later) to variants.exit
                      transition={{ type: "linear" }} // Set the transition to linear
                      className=""
                      key="comments"
                    >
                      <Box style={{ width: "50%" }}>
                        <Textarea label="comment" />
                      </Box>
                    </motion.main>
                  )}
                  {selectedTab === 2 && (
                    <motion.main
                      variants={variants} // Pass the variant object into Framer Motion
                      initial="hidden" // Set the initial state to variants.hidden
                      animate="enter" // Animated state to variants.enter
                      exit="exit" // Exit state (used later) to variants.exit
                      transition={{ type: "linear" }} // Set the transition to linear
                      className=""
                      key="activity"
                    >
                      <Text>0xavp created this card</Text>
                    </motion.main>
                  )}
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
                <CardDeadline />
                <CardPriority />
                <CardReward />
                <Button
                  center
                  prefix={<IconCheck />}
                  width="full"
                  size="small"
                  variant="secondary"
                  loading={loading}
                  onClick={() => {
                    onCardUpdate();
                  }}
                >
                  <Text>Save!</Text>
                </Button>
                <Button
                  center
                  prefix={<IconClose />}
                  width="full"
                  size="small"
                  variant="secondary"
                  tone="red"
                >
                  <Text>Close Task</Text>
                </Button>
                {/* <DiscordThread /> */}
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
