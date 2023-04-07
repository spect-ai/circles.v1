import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import Filter from "./Filter";
import MyTasks from "./MyTasks";
import PaymentFilter from "./PaymentFilter";
import Sort from "./Sort";
import SearchCard from "./Search";

const Filtering = () => {
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

      <Box
        display="flex"
        flexDirection="row"
        gap="4"
        alignItems="center"
        width="1/2"
      >
        {formActions("manageSettings") && (
          <>
            <Filter />
            <Sort />
          </>
        )}
        {collection.collectionType === 1 && <PaymentFilter />}
        <MyTasks />
      </Box>
    </Box>
  );
};

export default Filtering;
