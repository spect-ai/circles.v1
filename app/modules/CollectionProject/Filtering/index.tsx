import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import Filter from "./Filter";
import { SearchCard } from "./Search";
import Sort from "./Sort";

export default function Filtering() {
  const { localCollection: collection } = useLocalCollection();

  const { formActions } = useRoleGate();
  return (
    <Box
      width="full"
      height="10"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="background"
      borderBottomRadius="large"
      borderTopRadius={collection?.collectionType === 1 ? "none" : "large"}
      marginBottom={collection?.collectionType === 1 ? "none" : "2"}
    >
      <SearchCard />
      {formActions("manageSettings") && (
        <Box
          display="flex"
          flexDirection="row"
          gap="10"
          alignItems="center"
          width="1/2"
        >
          <Filter />
          <Sort />
        </Box>
      )}
    </Box>
  );
}
