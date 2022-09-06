import { Gantt, Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./components/ViewSwitcher";

import { memo, useState } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import { CardType } from "@/app/types";
import useCardService from "@/app/services/Card/useCardService";

import { Box, Text } from "degen";

function GanttChart() {
  const { localProject: project, updateProject } = useLocalProject();
  const { updateCard } = useCardService();
  const currentDate = new Date();

  const cards: Task[] = Object.values(project.cards).map(function (
    card: CardType
  ) {
    const dates = {
      start: currentDate,
      end: currentDate,
    };
    if (!card?.startDate && !card?.deadline) {
      dates.start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      dates.end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2
      );
    }
    if (card?.startDate && !card?.deadline) {
      dates.start = new Date(card?.startDate);
      if (new Date(card?.startDate).getDate() > 28) {
        dates.end = new Date(
          new Date(card?.startDate).getFullYear(),
          new Date(card?.startDate).getMonth() + 1,
          1
        );
      } else {
        dates.end = new Date(
          new Date(card?.startDate).getFullYear(),
          new Date(card?.startDate).getMonth(),
          new Date(card?.startDate).getDate() + 2
        );
      }
    }
    if (!card?.startDate && card?.deadline) {
      dates.end = new Date(card?.deadline);
      if (new Date(card?.deadline).getDate() > 1) {
        dates.start = new Date(
          new Date(card?.deadline).getFullYear(),
          new Date(card?.deadline).getMonth(),
          new Date(card?.deadline).getDate() - 1
        );
      } else {
        dates.start = new Date(
          new Date(card?.deadline).getFullYear(),
          new Date(card?.deadline).getMonth() - 1,
          29
        );
      }
    }
    if (card?.startDate && card?.deadline) {
      dates.start = new Date(card?.startDate);
      dates.end = new Date(card?.deadline);
    }
    return {
      start: dates.start,
      end: dates.end,
      name: card.title,
      id: card.id,
      type: "task",
      progress: 0,
    };
  });

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
  const [tasks, setTasks] = useState<Task[]>(cards);
  const [isChecked, setIsChecked] = useState(true);

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

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  return (
    <Box style={{ margin: "0rem 1rem 1rem 1rem" }}>
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
          gap: "0.5rem",
        }}
      >
        {isChecked && (
          <Box
            position={"fixed"}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box width="60" style={{ padding: "0.7rem 0rem" }}>
              <Text variant="base" weight="semiBold">
                Cards
              </Text>
            </Box>
            {tasks?.map((task) => {
              return (
                <Box
                  key={task?.id}
                  width="60"
                  style={{ margin: "0.77rem 0rem" }}
                >
                  <Text variant="base" weight="semiBold" color="textSecondary">
                    {task?.name}
                  </Text>
                </Box>
              );
            })}
          </Box>
        )}

        <Box overflow="auto" marginLeft={isChecked ? "60" : "4"}>
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            onClick={handleClick}
            listCellWidth={""}
            columnWidth={columnWidth}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default memo(GanttChart);
