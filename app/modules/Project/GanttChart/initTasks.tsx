import { ProjectType, CardType } from "@/app/types";
import { Task } from "gantt-task-react/dist/types/public-types";

export function initTasks(project: ProjectType) {
  const currentDate = new Date();
  if (!project.cards) return [];
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
      project: card.slug,
      type: "task",
      progress: 0,
    };
  });

  return cards;
}
