import { Gantt, Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./components/ViewSwitcher";
import { initTasks } from "./initTasks";
import TaskBar from "./components/TaskBar";

import { memo, useState, useEffect } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CardType } from "@/app/types";
import useCardService from "@/app/services/Card/useCardService";
import styled from "styled-components";

import { Box, useTheme } from "degen";
import { useRouter } from "next/router";

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

function GanttChart() {
  const { localProject: project, updateProject } = useLocalProject();
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { updateCard } = useCardService();
  const { mode } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--box-background-color",
      `${mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"}`
    );
    document.documentElement.style.setProperty(
      "--text-color",
      `${mode === "dark" ? "rgb(240,240,240, 0.7)" : "rgb(20,20,20, 0.7)"}`
    );
    document.documentElement.style.setProperty(
      "--border-color",
      `${mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(0, 0, 0, 0.08)"}`
    );
  }, [mode]);

  const onCardUpdate = async (
    card: CardType,
    startDate: Date,
    endDate: Date
  ) => {
    if (!card?.id) return;
    const payload: { [key: string]: any } = {
      title: card.title,
      description: card.description,
      reviewer: card.reviewer,
      assignee: card.assignee,
      project: project?.id,
      circle: project?.parents[0].id,
      type: card.type,
      deadline: endDate,
      startDate: startDate,
      labels: card.labels,
      priority: card.priority,
      columnId: card.columnId,
      reward: {
        chain: card.reward.chain,
        token: card.reward.token,
        value: card.reward.value,
      },
    };
    console.log(payload.deadline);
    const res = await updateCard(payload, card.id);
    if (res) {
      updateProject(res.project);
    }
  };

  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks(project));
  const [isChecked, setIsChecked] = useState(false);

  let columnWidth = 90;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    const card = project.cards?.[task.id];
    void onCardUpdate(card, task.start, task.end);
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(newTasks);
  };

  const handleDblClick = (task: Task) => {
    void router.push(`/${cId}/${pId}/${task.project}`);
  };

  return (
    <Container>
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
        viewMode={view}
      />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.0rem",
        }}
      >
        {isChecked && <TaskBar tasks={tasks} />}
        <Box
          overflow="auto"
          transitionDuration="700"
          style={{ width: isChecked ? "calc(100vw - 25rem)" : "100vw" }}
        >
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            onDoubleClick={handleDblClick}
            listCellWidth={""}
            columnWidth={columnWidth}
            ganttHeight={isChecked ? undefined : 500}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default memo(GanttChart);
