import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import useDragEnd from "../Hooks/useDragEnd";
import ColumnComponent from "../Column";
import { SkeletonLoader } from "../SkeletonLoader";
import { filterCards } from "./filterCards";
import { Filter, Views } from "@/app/types";

interface Props{
  viewId: string;
}

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

function Board({viewId}: Props) {
  const { handleDragEnd } = useDragEnd();
  const { localProject: project, loading } = useLocalProject();
  const { canDo } = useRoleGate();

  const view: Views = project.viewDetails?.[viewId as string]!;  
  const viewCards = filterCards(project, view?.filters as Filter);

  const DroppableContent = (provided: DroppableProvided) => (
    <Container {...provided.droppableProps} ref={provided.innerRef}>
      <Stack direction="horizontal">
        {view.filters?.column.length > 0 ? (
          view.filters?.column?.map((columnId, index): any => {
            const column = project.columnDetails[columnId];
            const cards = column?.cards?.map(
              (cardId: any) => viewCards[cardId]
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
          })
        ):(
          project?.columnOrder?.map((columnId, index): any => {
            const column = project.columnDetails[columnId];
            const cards = column.cards?.map(
              (cardId: any) => viewCards[cardId]
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
          })
        )}
        
        {provided.placeholder}
      </Stack>
    </Container>
  );

  const DroppableContentCallback = useCallback(DroppableContent, [
    project.columnDetails,
    project?.columnOrder,
    project,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {DroppableContentCallback}
      </Droppable>
    </DragDropContext>
  );
}

export default memo(Board);
