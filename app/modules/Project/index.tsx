import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useMutation, useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import ColumnComponent from "./Column";
import { useLocalProject } from "./Context/LocalProjectContext";
import useDragEnd from "./Hooks/useDragEnd";

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
  const { loading, localProject: project } = useLocalProject();
  if (loading) {
    return <div>Loading...</div>;
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
          {(provided, snapshot) => (
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
                <Box style={{ width: "20rem" }}>
                  <Button
                    // disabled={project.roles[user?.id as string] !== 3}
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
