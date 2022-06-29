import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import Tabs from "@/app/common/components/Tabs";
import useCardDynamism from "@/app/services/Card/useCardDynamism";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Tag } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import BatchPay from "../Project/BatchPay";
import { useLocalCard } from "../Project/CreateCardModal/hooks/LocalCardContext";
import CardAssignee from "../Project/CreateCardModal/modals/CardAssignee";
import CardColumn from "../Project/CreateCardModal/modals/CardColumn";
import CardDeadline from "../Project/CreateCardModal/modals/CardDeadline";
import CardLabels from "../Project/CreateCardModal/modals/CardLabels";
import CardPriority from "../Project/CreateCardModal/modals/CardPriority";
import CardReviewer from "../Project/CreateCardModal/modals/CardReviewer";
import CardReward from "../Project/CreateCardModal/modals/CardReward";
import CardType from "../Project/CreateCardModal/modals/CardType";
import ActionPopover from "./ActionPopover";
import Activity from "./Activity";
import Application from "./Application";
import Apply from "./Apply";
import Submission from "./Submission";
import SubTasks from "./SubTasks";

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 7rem);
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

export default function Card() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabClick = (index: number) => setSelectedTab(index);
  const {
    loading,
    title,
    setTitle,
    labels,
    description,
    setDescription,
    project,
    onCardUpdate,
    card,
    cardType,
  } = useLocalCard();

  const { canTakeAction } = useRoleGate();

  const { getTabs, activityTab, applicationTab, submissionTab } =
    useCardDynamism();

  return (
    <Box padding="4">
      <ToastContainer />
      {loading && <Loader loading={loading} text="" />}
      {!loading && (
        <Stack direction="horizontal">
          <Box width="3/4" paddingX={{ xs: "4" }}>
            <Container padding="2">
              <Stack direction="vertical">
                <Stack direction="horizontal">
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
                  {canTakeAction("cardPopoverActions") && <ActionPopover />}
                </Stack>
                <Stack direction="horizontal" wrap>
                  <CardLabels />
                  {labels.map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </Stack>
                <SubTasks />
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
                      placeholder="Add a description"
                      disabled={!canTakeAction("cardDescription")}
                      onBlur={() => {
                        onCardUpdate();
                      }}
                    />
                  )}
                </Box>
                <Tabs
                  tabs={getTabs()}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                  orientation="horizontal"
                  unselectedColor="transparent"
                  shape="circle"
                />
                <AnimatePresence initial={false}>
                  {selectedTab === activityTab && <Activity />}
                  {selectedTab === applicationTab && !loading && (
                    <Application />
                  )}
                  {selectedTab === submissionTab && !loading && <Submission />}
                </AnimatePresence>
              </Stack>
            </Container>
          </Box>
          <Box
            width="1/4"
            borderLeftWidth="0.375"
            paddingLeft="4"
            paddingTop="3"
          >
            {project?.id && (
              <Stack>
                <CardType />
                <CardColumn />
                <CardAssignee />
                <CardReviewer />
                <CardDeadline />
                <CardPriority />
                <CardReward />
                {/* <DiscordThread /> */}
                {canTakeAction("cardPayment") && <BatchPay card={card} />}
                {cardType === "Bounty" && canTakeAction("cardApply") && (
                  <Apply />
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
