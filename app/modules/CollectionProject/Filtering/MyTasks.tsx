import { Box, Tag } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {};

export default function MyTasks({}: Props) {
  const {
    showMyTasks,
    setShowMyTasks,
    localCollection: collection,
  } = useLocalCollection();
  if (collection.collectionType === 1)
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
  else return null;
}
