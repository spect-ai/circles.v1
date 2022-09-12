import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import useDragEnd from "../Hooks/useDragEnd";
import useDragAssignee from "../Hooks/useDragAssignee";
import ColumnComponent from "../Column";
import { SkeletonLoader } from "../SkeletonLoader";
import { filterCards } from "../Filter/filterCards";
import { CardsType, CardType, Filter } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import {
  titleFilter,
  sortBy,
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
  height: calc(100vh - 7rem);
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
  const { handleDrag } = useDragAssignee();
  const {
    localProject: project,
    setLocalProject,
    loading,
    advFilters,
  } = useLocalProject();

  const { currentFilter } = useGlobal();
  const { canDo } = useRoleGate();

  const [viewCards, setViewCards] = useState({} as CardsType);
  const [filteredCards, setFilteredCards] = useState({} as CardsType);
  const view = project.viewDetails?.[viewId];

  useEffect(() => {
    const fCards = filterCards(project, project.cards, currentFilter);
    setFilteredCards(fCards);
    const vCards = filterCards(project, project.cards, view?.filters as Filter);
    const fVCards = filterCards(project, vCards, currentFilter);
    setViewCards(fVCards);
  }, [
    project?.cards,
    project,
    view?.filters,
    project?.columnOrder,
    currentFilter,
  ]);

  const { getOptions } = useModalOptions();
  const options = getOptions("assignee");
  const assigneeIds = options?.map((person) => person.value);
  const assigneecolumn = options?.map((person) => ({
    columnId: person.value,
    name: person.name,
    cards: [""],
    defaultCardType: "Task",
  }));

  const filterAndSort = useCallback(
    (cards: CardType[]) => {
      cards = cards.filter((i) => i !== undefined);
      const fcards = titleFilter(cards, advFilters.inputTitle);
      cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
      return cards;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      advFilters.inputTitle,
      advFilters.order,
      advFilters.sortBy,
      project?.cards,
      project?.columnDetails,
      project,
    ]
  );

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
            cards = filterAndSort(cards);
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
        {viewId &&
          advFilters?.groupBy == "Status" &&
          project?.columnOrder?.map((columnId, index): any => {
            const column = project.columnDetails[columnId];
            if (
              (view?.filters as Filter)?.column?.length > 0 &&
              !(view?.filters as Filter).column?.includes(column?.name)
            )
              return null;
            let cards = column.cards?.map((cardId: string) =>
              viewId ? viewCards[cardId] : project.cards[cardId]
            );
            cards = filterAndSort(cards);

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

  const AssigneeCol = () => (
    <Container>
      <Stack direction="horizontal">
        {!viewId &&
          advFilters?.groupBy == "Assignee" &&
          assigneeIds?.map((assigneeId, index): any => {
            const column = assigneecolumn?.[index];
            let cards = groupByAssignee(assigneeId as string, filteredCards);
            cards = filterAndSort(cards);

            return (
              <AssigneeColumn
                key={assigneeId}
                column={column as any}
                cards={cards}
              />
            );
          })}
        {viewId &&
          advFilters?.groupBy == "Assignee" &&
          assigneeIds?.map((assigneeId, index): any => {
            const column = assigneecolumn?.[index];
            let cards = groupByAssignee(assigneeId as string, viewCards);
            cards = filterAndSort(cards);

            return (
              <AssigneeColumn
                key={assigneeId}
                column={column as any}
                cards={cards}
              />
            );
          })}
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
    <>
      {advFilters.groupBy == "Status" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {DroppableContentCallback}
          </Droppable>
        </DragDropContext>
      )}
      {advFilters.groupBy == "Assignee" && (
        <DragDropContext onDragEnd={handleDrag}>
          <AssigneeCol />
        </DragDropContext>
      )}
    </>
  );
}

export default memo(BoardView);
