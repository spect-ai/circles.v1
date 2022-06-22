import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { ColumnType } from "@/app/types";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useLocalProject } from "../Context/LocalProjectContext";

export default function useDragEnd() {
  const { localProject, setLocalProject, updateProject } = useLocalProject();
  const { canMoveCard } = useRoleGate();

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!canMoveCard(localProject.cards[draggableId])) {
      toast.error("You don't have permission to move this card", {
        theme: "dark",
      });
      return;
    }
    if (!destination) {
      return;
    }
    // console.log({ localProject });
    // const task = localProject.cards[draggableId];
    // if (
    //   type !== "column" &&
    //   !(
    //     (task.access.assignee || task.access.creator || task.access.reviewer)
    //     // [2, 3].includes(localProject.roles[user?.id as string])
    //   )
    // ) {
    //   return;
    // }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "column") {
      const newColumnOrder = reorder(
        localProject.columnOrder,
        source.index,
        destination.index
      );
      const tempData = { ...localProject };
      setLocalProject({
        ...localProject,
        columnOrder: newColumnOrder,
      });
      fetch(`http://localhost:3000/project/${localProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          columnOrder: newColumnOrder,
        }),
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.id) {
            updateProject(data);
          }
          console.log({ data });
        })
        .catch((err) => {
          console.log({ err });
        });
      return;
    }

    const start = localProject.columnDetails[source.droppableId];
    const finish = localProject.columnDetails[destination.droppableId];

    if (start === finish) {
      const newList = reorder(start.cards, source.index, destination.index);
      const tempData = { ...localProject };
      setLocalProject({
        ...localProject,
        columnDetails: {
          ...localProject.columnDetails,
          [result.source.droppableId]: {
            ...localProject.columnDetails[result.source.droppableId],
            cards: newList,
          },
        },
      });
    } else {
      const startTaskIds = Array.from(start.cards); // copy
      console.log({ source });
      startTaskIds.splice(source.index, 1);
      console.log({ startTaskIds });
      const newStart: ColumnType = {
        ...start,
        cards: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.cards); // copy
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish: ColumnType = {
        ...finish,
        cards: finishTaskIds,
      };
      const tempData = { ...localProject };

      setLocalProject({
        ...localProject,
        columnDetails: {
          ...localProject.columnDetails,
          [newStart.columnId]: newStart,
          [newFinish.columnId]: newFinish,
        },
      });
    }
    fetch(
      `http://localhost:3000/project/${localProject.id}/reorderCard/${draggableId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationColumnId: destination.droppableId,
          destinationCardIndex: destination.index,
        }),
        credentials: "include",
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (data.id) {
          updateProject(data);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return {
    handleDragEnd,
    localProject,
  };
}
