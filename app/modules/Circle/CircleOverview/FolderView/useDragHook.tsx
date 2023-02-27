import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";
import { updateFolderDetails, updateFolder } from "@/app/services/Folders";

export default function useDragFolder() {
  const { circle, setCircleData } = useCircle();
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

      setCircleData({
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
          if (data?.id) {
            setCircleData(data);
          }
        })
        .catch((err) => {
          console.log({ err });
        });
      return;
    }

    const start = circle.folderDetails[source.droppableId];
    const finish = circle.folderDetails[destination.droppableId];

    if (start === finish) {
      const newList = reorder(
        start.contentIds,
        source.index,
        destination.index
      );

      setCircleData({
        ...circle,
        folderDetails: {
          ...circle.folderDetails,
          [result.source.droppableId]: {
            ...circle.folderDetails[result.source.droppableId],
            contentIds: newList,
          },
        },
      });

      const update = async () => {
        const res = await updateFolder(
          { contentIds: newList },
          circle.id,
          source.droppableId
        );
        if (res?.id) {
          setCircleData(res);
        }
      };
      void update();
      return;
    } else {
      const startContentIds = Array.from(start.contentIds);
      startContentIds.splice(source.index, 1);
      const newStart = {
        ...start,
        contentIds: startContentIds,
      };

      const finishContentIds = Array.from(finish.contentIds);
      finishContentIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        contentIds: finishContentIds,
      };
      setCircleData({
        ...circle,
        folderDetails: {
          ...circle.folderDetails,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });

      const update = async () => {
        const res = await updateFolderDetails(circle.id, {
          folderDetails: [
            { id: newStart.id, contentIds: startContentIds },
            { id: newFinish.id, contentIds: finishContentIds },
          ],
        });
        ({ res });
        if (res?.id) {
          setCircleData(res);
        }
      };
      void update();
      return;
    }
  };

  return {
    handleDrag,
    circle,
  };
}
