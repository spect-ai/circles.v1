import { Box, Tag, IconSearch } from "degen";
import { useLocalProject } from "../../Context/LocalProjectContext";
import styled from "styled-components";

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
`;

export function SearchByTitle() {
  const { advFilters, setAdvFilters } = useLocalProject();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" paddingLeft="3">
      <IconSearch size="4" color="foreground" />
      <Input
        placeholder="Search Card"
        value={advFilters.inputTitle}
        onChange={(e) => {
          setAdvFilters({
            ...advFilters,
            inputTitle: e.target.value,
          });
        }}
      />
      {advFilters.inputTitle.length > 0 && (
        <Box
          onClick={() =>
            setAdvFilters({
              ...advFilters,
              inputTitle: "",
            })
          }
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
