import { BoardData } from "@/app/types";
import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";

export default function useDragEnd() {
  const mockData: BoardData = {
    columnOrder: ["column-0", "column-1", "column-2", "column-3"],
    columns: {
      "column-0": {
        id: "column-0",
        title: "To Do",
        taskIds: ["task-0", "task-1", "task-2", "task-3", "task-4"],
      },
      "column-1": {
        id: "column-1",
        title: "In Progress",
        taskIds: ["task-5", "task-6", "task-7"],
      },
      "column-2": {
        id: "column-2",
        title: "In Review",
        taskIds: ["task-8", "task-9"],
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        taskIds: ["task-10"],
      },
    },
    tasks: {
      "task-0": {
        id: "task-0",
        title: "Task 1",
      },
      "task-1": {
        id: "Task 1",
        title: "Task 1",
      },
      "task-2": {
        id: "Task 2",
        title: "Task 2",
      },
      "task-3": {
        id: "Task 2",
        title: "Task 2",
      },
      "task-4": {
        id: "Task 2",
        title: "Task 2",
      },
      "task-5": {
        id: "task-5",
        title: "Task 5",
      },
      "task-6": {
        id: "task-5",
        title: "Task 5",
      },
      "task-7": {
        id: "task-5",
        title: "Task 5",
      },
      "task-8": {
        id: "task-5",
        title: "Task 5",
      },
    },
    objectId: "",
    name: "",
    teamId: "",
    createdAt: "",
    updatedAt: "",
    statusList: [],
    members: [],
    memberDetails: undefined,
    access: "",
    roles: {},
    roleMapping: {},
    userRole: 0,
    epochs: [],
    _id: "",
    _createdAt: "",
    team: [],
    defaultPayment: undefined,
    tokenGating: undefined,
    description: "",
    private: false,
    creatingEpoch: false,
    guildId: "",
    discussionChannel: undefined,
    githubRepos: [],
  };

  const [space, setSpace] = useState(mockData);

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    const task = space.tasks[draggableId];
    if (
      type !== "column" &&
      !(
        (task.access.assignee || task.access.creator || task.access.reviewer)
        // [2, 3].includes(space.roles[user?.id as string])
      )
    ) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "column") {
      const newColumnOrder = reorder(
        space.columnOrder,
        source.index,
        destination.index
      );
      const tempData = { ...space };
      setSpace({
        ...space,
        columnOrder: newColumnOrder,
      });
      return;
    }

    const start = space.columns[source.droppableId];
    const finish = space.columns[destination.droppableId];

    if (start === finish) {
      const newList = reorder(start.taskIds, source.index, destination.index);
      const tempData = { ...space };
      setSpace({
        ...space,
        columns: {
          ...space.columns,
          [result.source.droppableId]: {
            ...space.columns[result.source.droppableId],
            taskIds: newList,
          },
        },
      });
    } else {
      const startTaskIds = Array.from(start.taskIds); // copy
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds); // copy
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };
      const tempData = { ...space };
      setSpace({
        ...space,
        columns: {
          ...space.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
    }
  };

  return {
    handleDragEnd,
    space,
  };
}
