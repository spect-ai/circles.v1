import { DropResult } from "react-beautiful-dnd";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function useDragCollectionProperty() {
  const { localCollection, setLocalCollection, updateCollection, setUpdating } =
    useLocalCollection();

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const handleDragCollectionProperty = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    console.log(destination?.droppableId);
    console.log(destination?.index);
    console.log(type);
    console.log(draggableId);

    if (
      destination?.droppableId === source.droppableId &&
      destination?.index === source.index
    ) {
      return;
    }
  };

  return {
    handleDragCollectionProperty,
  };
}
