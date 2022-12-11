import { Box } from "degen";
import Filter from "./Filter";
import { SearchCard } from "./Search";

export default function Filtering() {
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
    >
      <SearchCard />
      <Box
        display="flex"
        flexDirection="row"
        //   width={hide ? "76" : advFilters.sortBy == "none" ? "1/2" : "168"}
        //   gap={project.defaultView == "Gantt" ? "4" : "10"}
        alignItems="center"
        width="1/2"
      >
        <Filter />
        {/* <Filter />
          <SortBy />
          {show && <GroupBy />}
          {show && <Show />} */}
      </Box>
    </Box>
  );
}
