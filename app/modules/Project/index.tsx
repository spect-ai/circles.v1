import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import ColumnComponent from "./Column";
import { useLocalProject } from "./Context/LocalProjectContext";
import useDragEnd from "./Hooks/useDragEnd";
import { SkeletonLoader } from "./SkeletonLoader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Onboarding from "./ProjectOnboarding";
import useProjectOnboarding from "@/app/services/Onboarding/useProjectOnboarding";
import { motion } from "framer-motion";
import { fadeVariant } from "../Card/Utils/variants";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 4.5rem);
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
  overflow-x: auto;
  overflow-y: hidden;
`;

function Project() {
  const { handleDragEnd } = useDragEnd();
  const { loading, localProject: project, setLocalProject } = useLocalProject();
  const { canDo } = useRoleGate();
  const { onboarded } = useProjectOnboarding();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <motion.main
      variants={fadeVariant}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
    >
      <Box paddingY="1">
        <ToastContainer
          toastStyle={{
            backgroundColor: "rgb(20,20,20)",
            color: "rgb(255,255,255,0.7)",
          }}
        />
        {!onboarded && canDo(["steward"]) && <Onboarding />}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                <Stack direction="horizontal">
                  {project?.columnOrder?.map((columnId, index): any => {
                    const column = project.columnDetails[columnId];
                    const cards = column.cards?.map(
                      (cardId: any) => project.cards[cardId]
                    );
                    return (
                      <ColumnComponent
                        key={columnId}
                        column={column}
                        cards={cards}
                        id={columnId}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  {project?.id && canDo(["steward"]) && (
                    <Box style={{ width: "20rem" }} marginTop="2">
                      <PrimaryButton
                        variant="tertiary"
                        icon={<IconPlusSmall />}
                        onClick={async () => {
                          const updatedProject = await addColumn(project.id);
                          if (!updatedProject) {
                            toast.error("Error adding column", {
                              theme: "dark",
                            });
                          }
                          setLocalProject(updatedProject);
                        }}
                      >
                        Add new column
                      </PrimaryButton>
                    </Box>
                  )}
                </Stack>
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </motion.main>
  );
}

export default memo(Project);
