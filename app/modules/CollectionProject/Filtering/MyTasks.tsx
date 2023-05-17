import { Box, Button, Text } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { CgCardSpades } from "react-icons/cg";

type Props = {};

export default function MyTasks({}: Props) {
  const {
    showMyTasks,
    setShowMyTasks,
    localCollection: collection,
  } = useLocalCollection();
  if (collection.collectionType === 1)
    return (
      <Button
        variant="transparent"
        size="extraSmall"
        onClick={() => setShowMyTasks(!showMyTasks)}
      >
        <Box
          cursor="pointer"
          marginLeft="2"
          alignItems="center"
          display="flex"
          gap="1"
          flexDirection="row"
        >
          <Text color={showMyTasks ? "accent" : "textSecondary"}>
            {" "}
            <CgCardSpades size={18} />
          </Text>

          <Text variant="label">My cards</Text>
        </Box>
      </Button>
    );
  else return null;
}
