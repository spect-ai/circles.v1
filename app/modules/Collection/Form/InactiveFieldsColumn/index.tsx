import { Box, Stack } from "degen";
import { memo } from "react";
import styled from "styled-components";
import Pages from "../Pages";

const Container = styled(Box)`
  width: 100%;
  margin-top: -1rem;
`;

function InactiveFieldsColumnComponent() {
  return (
    <Box
      marginTop={{
        xs: "12",
        md: "0",
      }}
      paddingX={{
        xs: "4",
        md: "0",
      }}
    >
      <Container>
        <Box marginTop="2">
          <Stack>
            <Pages />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default memo(InactiveFieldsColumnComponent);
