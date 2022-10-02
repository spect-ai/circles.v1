import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";
import { updateFolderDetails, updateFolder } from "@/app/services/Folders";

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

    if (
      source.droppableId === "unclassified" &&
      destination.droppableId === "unclassified"
    )
      return;

    if (start === finish && source.droppableId !== "unclassified") {
      const newList = reorder(
        start.contentIds,
        source.index,
        destination.index
      );

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

      async () => {
        const res = await updateFolder(
          { contentIds: newList },
          circle.id,
          source.droppableId
        );
        console.log({ res });
        if (res.id) {
          setCircleData(res);
        }
      };
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

      if (
        source.droppableId !== "unclassified" &&
        destination.droppableId !== "unclassified"
      ) {
        setLocalCircle({
          ...circle,
          folderDetails: {
            ...circle.folderDetails,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
          },
        });

        async () => {
          const res = await updateFolderDetails(circle.id, {
            folderDetails: [
              { id: newStart.id, contentIds: startContentIds },
              { id: newFinish.id, contentIds: finishContentIds },
            ],
          });
          console.log({ res });
          if (res.id) {
            setCircleData(res);
          }
        };
        return;
      } else {
        if (destination.droppableId === "unclassified") {
          setLocalCircle({
            ...circle,
            folderDetails: {
              ...circle.folderDetails,
              [newStart.id]: newStart,
            },
          });
          async () => {
            const res = await updateFolder(
              { contentIds: startContentIds },
              circle.id,
              source.droppableId
            );
            console.log({ res });
            if (res.id) {
              setCircleData(res);
            }
          };
          return;
        }
        if (source.droppableId === "unclassified") {
          setLocalCircle({
            ...circle,
            folderDetails: {
              ...circle.folderDetails,
              [newFinish.id]: newFinish,
            },
          });
          async () => {
            const res = await updateFolder(
              { contentIds: finishContentIds },
              circle.id,
              destination.droppableId
            );
            console.log({ res });
            if (res.id) {
              setCircleData(res);
            }
          };
          return;
        }
      }
    }
  };

  return {
    handleDrag,
    circle,
  };
}
