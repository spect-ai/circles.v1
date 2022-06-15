import { ProjectType } from "@/app/types";
import { Box, Button, Heading, IconPlusSmall, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import ColumnComponent from "./Column";
import useDragEnd from "./Hooks/useDragEnd";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 7rem);
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
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const { space, handleDragEnd } = useDragEnd();
  return (
    <Box padding="4">
      <ToastContainer />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided, snapshot) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              <Stack direction="horizontal">
                {space.columnOrder.map((columnId, index) => {
                  const column = space.columns[columnId];
                  console.log({ column, space });
                  const tasks = column.taskIds?.map(
                    (taskId: any) => space.tasks[taskId]
                  );
                  return (
                    <ColumnComponent
                      key={columnId}
                      column={column}
                      tasks={tasks}
                      id={columnId}
                      index={index}
                    />
                  );
                })}
                {provided.placeholder}
                <Box style={{ width: "20rem" }}>
                  <Button
                    // disabled={space.roles[user?.id as string] !== 3}
                    width="full"
                    size="small"
                    variant="secondary"
                    prefix={<IconPlusSmall />}
                    center
                  >
                    <Text>Add new column</Text>
                  </Button>
                </Box>
              </Stack>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
