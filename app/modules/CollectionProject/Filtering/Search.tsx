import { Box, IconSearch, Tag } from "degen";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export function SearchCard() {
  const {
    searchFilter,
    setSearchFilter,
    localCollection: collection,
  } = useLocalCollection();
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      paddingLeft="4"
      width={{
        xs: "48",
        md: "72",
      }}
    >
      <IconSearch size="4" color="foreground" />
      <Input
        placeholder={
          collection?.collectionType == 1 ? "Search Card" : "Search Response"
        }
        value={searchFilter}
        onChange={(e) => {
          setSearchFilter(e.target.value);
        }}
      />
      {searchFilter.length > 0 && (
        <Box
          onClick={() => setSearchFilter("")}
          style={{
            cursor: "pointer",
          }}
        >
          <Tag size="medium" hover>
            Clear
          </Tag>
        </Box>
      )}
    </Box>
  );
}

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
  width: 100%;
`;
