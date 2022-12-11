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
      style={{
        boxShadow: "0px 14px 8px rgba(0, 0, 0, 0.9)",
      }}
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
