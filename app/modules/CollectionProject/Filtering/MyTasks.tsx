import { Box, Tag } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

const MyTasks = () => {
  const {
    showMyTasks,
    setShowMyTasks,
    localCollection: collection,
  } = useLocalCollection();
  if (collection.collectionType === 1) {
    return (
      <Box
        cursor="pointer"
        onClick={() => {
          setShowMyTasks(!showMyTasks);
        }}
        marginLeft="2"
      >
        <Tag hover tone={showMyTasks ? "accent" : undefined}>
          Show my cards
        </Tag>
      </Box>
    );
  }
  return null;
};

export default MyTasks;
