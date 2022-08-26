import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo, useCallback, useEffect, useState } from "react";
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
import { filterCards } from "../Filter/filterCards";
import { CardsType, Filter } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import {
  titleFilter,
  groupByAssignee,
  AssigneeColumn,
} from "@/app/modules/Project/ProjectHeading/AdvancedOptions";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

interface Props {
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

function BoardView({ viewId }: Props) {
  const { handleDragEnd } = useDragEnd();
  const {
    localProject: project,
    setLocalProject,
    loading,
    advFilters,
  } = useLocalProject();
  const { currentFilter } = useGlobal();
  const { canDo } = useRoleGate();

  const [viewCards, setViewCards] = useState({} as CardsType);

  const view = project.viewDetails?.[viewId];
  const viewFilter = view?.filters;
  const filteredCards = filterCards(project, currentFilter);

  const { getOptions } = useModalOptions();

  const options = getOptions("assignee");
  const assigneeIds = options?.map((person) => person.value);
  const assigneecolumn = options?.map((person) => ({
    columnId: person.value,
    name: person.name,
    cards: [],
    defaultCardType: "Task",
  }));

  useEffect(() => {
    const vCards = filterCards(project, viewFilter as Filter);
    setViewCards(vCards);
  }, [project?.cards, project, viewFilter, project?.columnOrder]);

  const DroppableContent = (provided: DroppableProvided) => (
    <Container {...provided.droppableProps} ref={provided.innerRef}>
      <Stack direction="horizontal">
        {!viewId &&
          advFilters?.groupBy == "Status" &&
          project?.columnOrder?.map((columnId, index): any => {
            const column = project.columnDetails[columnId];
            let cards = column.cards?.map(
              (cardId: string) => filteredCards[cardId]
            );
            cards = cards.filter((i) => i !== undefined);
            let fcards = titleFilter(cards, advFilters.inputTitle);
            fcards = fcards.filter((i) => i?.id !== undefined);

            return (
              <ColumnComponent
                key={columnId}
                column={column}
                cards={fcards}
                id={columnId}
                index={index}
              />
            );
          })}
        {!viewId &&
          advFilters?.groupBy == "Assignee" &&
          assigneeIds?.map((assigneeId, index): any => {
            const column = assigneecolumn?.[index];
            const cards = groupByAssignee(assigneeId as string, filteredCards);
            console.log(cards);
            
            let fcards = titleFilter(cards, advFilters.inputTitle);
            fcards = fcards.filter((i) => i?.id !== undefined);

            return (
              <AssigneeColumn
                key={assigneeId}
                column={column as any}
                cards={fcards}
              />
            );
          })}
        {viewId &&
          project?.columnOrder?.map((columnId, index): any => {
            if (
              (viewFilter as Filter)?.column?.length > 0 &&
              !(viewFilter as Filter).column?.includes(columnId)
            )
              return null;

            const column = project.columnDetails[columnId];
            let cards = column.cards?.map((cardId: string) =>
              viewId ? viewCards[cardId] : project.cards[cardId]
            );
            cards = cards.filter((i) => i !== undefined);

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
        {!viewId &&
          advFilters.groupBy == "Status" &&
          project?.id &&
          canDo(["steward"]) && (
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
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DroppableContentCallback = useCallback(DroppableContent, [
    project?.columnOrder,
    project.id,
    project.columnDetails,
    project.cards,
    canDo,
    setLocalProject,
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

export default memo(BoardView);
