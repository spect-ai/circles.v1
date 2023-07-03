import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box } from "degen";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import Filter from "./Filter";
import IncentiveFilter from "./IncentiveFilter";
import MyTasks from "./MyTasks";
import PaymentFilter from "./PaymentFilter";
import { SearchCard } from "./Search";
import Sort from "./Sort";

export default function Filtering() {
  const { localCollection: collection, authorization } = useLocalCollection();

  const { formActions } = useRoleGate();
  return (
    <Box
      width="full"
      height="10"
      display="flex"
      flexDirection="row"
      justifyContent={{
        xs: "flex-start",
        lg: "space-between",
      }}
      alignItems="center"
      backgroundColor="background"
      borderBottomRadius="large"
      borderTopRadius={collection?.collectionType === 1 ? "none" : "large"}
      marginBottom={"2"}
      paddingLeft="2"
    >
      <SearchCard />

      {authorization !== "readonly" && (
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
      )}
    </Box>
  );
}
