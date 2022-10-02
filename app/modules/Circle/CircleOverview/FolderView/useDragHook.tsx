import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType } from "@/app/types";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";

export default function useDragFolder() {
  const { localCircle: circle, setCircleData, setLocalCircle } = useCircle();
  const { canDo } = useRoleGate();

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const handleDrag = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!canDo("manageCircleSettings")) {
      toast.error("You don't have permission to handle folders", {
        theme: "dark",
      });
      return;
    }
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "folder") {
      const newFolderOrder = reorder(
        circle.folderOrder,
        source.index,
        destination.index
      );

      setLocalCircle({
        ...circle,
        folderOrder: newFolderOrder,
      });
      fetch(`${process.env.API_HOST}/circle/v1/${circle.id}/folderOrder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderOrder: newFolderOrder,
        }),
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.id) {
            setCircleData(data);
          }
          console.log({ data });
        })
        .catch((err) => {
          console.log({ err });
        });
      return;
    }

    const start = circle.folderDetails[source.droppableId];
    const finish = circle.folderDetails[destination.droppableId];

    if (start === finish) {
      const newList = reorder(start.contentIds, source.index, destination.index);

      setLocalCircle({
        ...circle,
        folderDetails: {
          ...circle.folderDetails,
          [result.source.droppableId]: {
            ...circle.folderDetails[result.source.droppableId],
            contentIds: newList,
          },
        },
      });

    } else {
      const startContentIds = Array.from(start.contentIds); // copy
      startContentIds.splice(source.index, 1);
      const newStart = {
        ...start,
        contentIds: startContentIds,
      };

      const finishContentIds = Array.from(finish.contentIds); // copy
      finishContentIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        contentIds: finishContentIds,
      };

      setLocalCircle({
        ...circle,
        folderDetails: {
          ...circle.folderDetails,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
    }
    fetch(`${process.env.API_HOST}/circle/v1/${circle?.id}/updateFolder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnId: destination.droppableId,
        cardIndex: destination.index,
      }),
      credentials: "include",
    })
      .then(async (res) => {
        const data: CircleType = await res.json();
        console.log({ data });
        if (data.id) {
          setCircleData(data);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return {
    handleDrag,
    circle,
  };
}
