import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";

import ListSection from "./ListSection";
import { filterCards } from "../Filter/filterCards";
import { Filter, CardsType, ColumnType } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";
import {
  titleFilter,
  sortBy,
  groupByAssignee,
} from "@/app/modules/Project/ProjectHeading/AdvancedOptions";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

interface Props {
  viewId: string;
}

const ScrollContainer = styled.div`
  height: calc(100vh - 7rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
  width: 100%;
`;

function ListView({ viewId }: Props) {
  const {
    localProject: project,
    setLocalProject,
    advFilters,
  } = useLocalProject();
  const { currentFilter } = useGlobal();
  const { canDo } = useRoleGate();

  const [viewCards, setViewCards] = useState({} as CardsType);
  const view = project.viewDetails?.[viewId];

  useEffect(() => {
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

  const filteredCards = filterCards(project, project.cards, currentFilter);

  const { getOptions } = useModalOptions();
  const options = getOptions("assignee");
  const assigneeIds = options?.map((person) => person.value);
  const assigneecolumn = options?.map((person) => ({
    columnId: person.value as string,
    name: person.name,
    cards: [""],
    defaultCardType: "Task",
    access: {
      canCreateCard: "",
    },
  }));

  return (
    <ScrollContainer>
      <Stack space="8">
        {!viewId &&
          advFilters?.groupBy == "Status" &&
          project?.columnOrder?.map((columnId: string) => {
            const column = project.columnDetails[columnId];
            let cards = column.cards?.map(
              (cardId: string) => filteredCards[cardId]
            );
            cards = cards.filter((i) => i !== undefined);
            const fcards = titleFilter(cards, advFilters.inputTitle);
            cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
            return <ListSection key={columnId} column={column} cards={cards} />;
          })}
        {!viewId &&
          advFilters?.groupBy == "Assignee" &&
          assigneeIds?.map((assigneeId, index): any => {
            const column = assigneecolumn?.[index];
            let cards = groupByAssignee(assigneeId as string, filteredCards);
            const fcards = titleFilter(cards, advFilters.inputTitle);
            cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
            return (
              <ListSection
                key={column?.columnId}
                column={column as ColumnType}
                cards={cards}
              />
            );
          })}
        {viewId &&
          advFilters?.groupBy == "Assignee" &&
          assigneeIds?.map((assigneeId, index): any => {
            const column = assigneecolumn?.[index];
            let cards = groupByAssignee(assigneeId as string, viewCards);
            const fcards = titleFilter(cards, advFilters.inputTitle);
            cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
            return (
              <ListSection
                key={column?.columnId}
                column={column as ColumnType}
                cards={cards}
              />
            );
          })}
        {viewId &&
          advFilters?.groupBy == "Status" &&
          project?.columnOrder?.map((columnId: string) => {
            const column = project.columnDetails[columnId];
            if (
              (view?.filters as Filter)?.column?.length > 0 &&
              !(view?.filters as Filter).column?.includes(column?.name)
            )
              return null;
            let cards = column.cards?.map((cardId: string) =>
              viewId ? viewCards[cardId] : project.cards[cardId]
            );
            cards = cards.filter((i) => i !== undefined);
            const fcards = titleFilter(cards, advFilters.inputTitle);
            cards = sortBy(advFilters.sortBy, fcards, advFilters.order);

            return <ListSection key={columnId} column={column} cards={cards} />;
          })}
        {!viewId &&
          advFilters?.groupBy == "Status" &&
          project?.id &&
          canDo("manageProjectSettings") && (
            <Box style={{ width: "20rem" }} marginTop="2" marginLeft="2">
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
                Add new section
              </PrimaryButton>
            </Box>
          )}
      </Stack>
    </ScrollContainer>
  );
}

export default memo(ListView);
