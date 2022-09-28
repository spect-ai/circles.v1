import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function useDragCollectionProperty() {
  const { localCollection, setLocalCollection, updateCollection, setUpdating } =
    useLocalCollection();

  const handleDragCollectionProperty = () => {};

  return {
    handleDragCollectionProperty,
  };
}
