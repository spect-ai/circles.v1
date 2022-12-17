import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, Text, useTheme } from "degen";
import React, { memo, useState } from "react";
import { useLocalProject } from "./Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
import useProjectOnboarding from "@/app/services/Onboarding/useProjectOnboarding";
import CreateSubmission from "@/app/modules/Card/Submission/CreateSubmission";

import { AnimatePresence, motion } from "framer-motion";
import { fadeVariant } from "../Card/Utils/variants";
import { useRouter } from "next/router";
import BoardView from "./BoardView";
import { ToastContainer } from "react-toastify";
import Onboarding from "./ProjectOnboarding";
import ListView from "./ListView";
import Apply from "../Card/Apply";
import { QuestionCircleOutlined } from "@ant-design/icons";
import GanttChart from "./GanttChart";
import TableView from "./TableView";
import FAQModal from "../Dashboard/FAQModal";

function Project() {
  const [graphOpen, setGraphOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const {
    localProject: project,
    selectedCard,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
  } = useLocalProject();
  const { canDo } = useRoleGate();
  const { onboarded } = useProjectOnboarding();
  const { setViewName } = useGlobal();

  const router = useRouter();
  const { card: tId, view: vId } = router.query;
  const { mode } = useTheme();

  if (tId || !project) {
    return null;
  }

  let viewId = "";

  if (vId !== undefined) {
    viewId = vId as string;
    setViewName(viewId);
  } else {
    viewId = "";
    setViewName(viewId);
  }

  const selectedView = project.viewDetails?.[viewId];

  console.log({ project });

  if (project?.unauthorized)
    return (
      <>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This project is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </>
    );

  return (
    <>
      <AnimatePresence>
        {/* {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )} */}
        {isApplyModalOpen && selectedCard && (
          <Apply setIsOpen={setIsApplyModalOpen} cardId={selectedCard.id} />
        )}
        {isSubmitModalOpen && selectedCard && (
          <CreateSubmission
            setIsOpen={setIsSubmitModalOpen}
            cardId={selectedCard.id}
          />
        )}
      </AnimatePresence>
      <motion.main
        variants={fadeVariant}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear" }}
      >
        <Box width="full" position={"relative"}>
          <ToastContainer
            toastStyle={{
              backgroundColor: `${
                mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
              }`,
              color: `${
                mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
              }`,
            }}
          />
          {!onboarded && canDo("createNewCircle") && <Onboarding />}
          {!vId && project.defaultView == "Board" && <BoardView viewId={""} />}
          {!vId && project.defaultView == "List" && <ListView viewId={""} />}
          {!vId && project.defaultView == "Gantt" && <GanttChart viewId={""} />}
          {!vId && project.defaultView == "Table" && <TableView viewId="" />}
          {vId && selectedView?.type == "Board" && (
            <BoardView viewId={viewId} />
          )}
          {vId && selectedView?.type == "List" && <ListView viewId={viewId} />}
          {vId && selectedView?.type == "Gantt" && (
            <GanttChart viewId={viewId} />
          )}
          {vId && selectedView?.type == "Table" && (
            <TableView viewId={viewId} />
          )}
          <Box
            style={{
              position: "absolute",
              right: "2rem",
              bottom: "1rem",
              zIndex: "1",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setFaqOpen(true)}
              shape="circle"
            >
              <QuestionCircleOutlined style={{ fontSize: "1.5rem" }} />
            </Button>
          </Box>
        </Box>
      </motion.main>
      <AnimatePresence>
        {faqOpen && <FAQModal handleClose={() => setFaqOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default memo(Project);
