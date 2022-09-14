import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CardType } from "@/app/types";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useLocalProject } from "../Context/LocalProjectContext";

export default function useDragAssignee() {
  const { localProject, setLocalProject, updateProject, setUpdating } =
    useLocalProject();
  const { canMoveCard } = useRoleGate();

  const handleDrag = (result: DropResult) => {
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
    if (destination.droppableId === source.droppableId) {
      return;
    }
    setLocalProject({
      ...localProject,
      cards: {
        ...localProject.cards,
        draggableId: {
          ...localProject.cards?.[draggableId],
          assignee:
            destination.droppableId == "unassigned"
              ? []
              : [destination.droppableId],
        },
      },
    });
    fetch(`${process.env.API_HOST}/card/v1/${draggableId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignee:
          destination.droppableId == "unassigned"
            ? []
            : [destination.droppableId],
      }),
      credentials: "include",
    })
      .then(async (res) => {
        const data: CardType = await res.json();
        console.log({ data });
        if (data?.id) {
          updateProject(data?.project);
          setUpdating(true);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return {
    handleDrag,
    localProject,
  };
}
