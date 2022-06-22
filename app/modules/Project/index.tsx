import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import ColumnComponent from "./Column";
import { useLocalProject } from "./Context/LocalProjectContext";
import useDragEnd from "./Hooks/useDragEnd";
import { SkeletonLoader } from "./SkeletonLoader";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 6.5rem);
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 6.5rem);
    padding: 0 0.5rem;
  }
  overflow-x: auto;
  overflow-y: hidden;
`;

export default function Project() {
  const { handleDragEnd } = useDragEnd();
  const { loading, localProject: project, setLocalProject } = useLocalProject();

  const { canDo } = useRoleGate();
  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box padding="4">
      <ToastContainer />
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
                {canDo(["steward"]) && (
                  <Box style={{ width: "20rem" }}>
                    <Button
                      // disabled={project.roles[user?.id as string] !== 3}
                      width="full"
                      size="small"
                      variant="secondary"
                      prefix={<IconPlusSmall />}
                      center
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
                      <Text>Add new column</Text>
                    </Button>
                  </Box>
                )}
              </Stack>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
