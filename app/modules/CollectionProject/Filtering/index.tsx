import { Box } from "degen";
import Filter from "./Filter";
import { SearchCard } from "./Search";
import Sort from "./Sort";

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
        gap="10"
        alignItems="center"
        width="1/2"
      >
        <Filter />
        <Sort />
      </Box>
    </Box>
  );
}
