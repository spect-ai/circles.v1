import { Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./components/ViewSwitcher";
import { initTasks } from "./initTasks";
import GanttTable from "./components/GanttTable";

import { memo, useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Text } from "degen";

import { useLocalProject } from "../Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
import { SkeletonLoader } from "../SkeletonLoader";
import { filterCards } from "../Filter/filterCards";
import { Filter, CardsType } from "@/app/types";

import {
  titleFilter,
  sortBy,
} from "@/app/modules/Project/ProjectHeading/AdvancedOptions";

const Container = styled.div`
  margin: 0rem 1rem 1rem 1rem;
  height: calc(100vh - 7.5rem);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
`;

function GanttChart({ viewId }: { viewId: string }) {
  const { localProject: project, loading, advFilters } = useLocalProject();
  const { currentFilter } = useGlobal();

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

  const [calendarView, setCalendarView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let tcards;
    if (viewId === "") {
      tcards = filteredCards;
    } else {
      tcards = viewCards;
    }
    let cards =
      tcards &&
      Object.values(tcards)?.filter((card) => card.status.active == true);
    const fcards = titleFilter(cards, advFilters.inputTitle);
    cards = sortBy(advFilters.sortBy, fcards, advFilters.order);
    setTasks(initTasks(cards));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewCards, project?.cards]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!tasks?.[0]?.id) {
    return (
      <Container>
        <Box style={{ margin: "21% 42%" }}>
          <Text color="accent">No cards found</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <ViewSwitcher
        onViewModeChange={(viewMode) => setCalendarView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
        viewMode={calendarView}
      />
      <GanttTable
        tasks={tasks}
        setTasks={setTasks}
        calendarView={calendarView}
        isChecked={isChecked}
      />
    </Container>
  );
}

export default memo(GanttChart);
