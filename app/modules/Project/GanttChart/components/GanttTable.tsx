import { Gantt, Task, ViewMode } from "gantt-task-react";
import TaskBar from "./TaskBar";

import { useEffect } from "react";
import { Box, useTheme } from "degen";
import { useRouter } from "next/router";

import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import { CardType } from "@/app/types";
import useCardService from "@/app/services/Card/useCardService";

interface Props {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  calendarView: ViewMode;
  isChecked: boolean;
}

export default function GanttTable({
  tasks,
  setTasks,
  calendarView,
  isChecked,
}: Props) {
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

  let columnWidth = 90;
  if (calendarView === ViewMode.Year) {
    columnWidth = 350;
  } else if (calendarView === ViewMode.Month) {
    columnWidth = 300;
  } else if (calendarView === ViewMode.Week) {
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
          viewMode={calendarView}
          onDateChange={handleTaskChange}
          onDoubleClick={handleDblClick}
          listCellWidth={""}
          columnWidth={columnWidth}
          ganttHeight={isChecked ? undefined : 500}
        />
      </Box>
    </Box>
  );
}
