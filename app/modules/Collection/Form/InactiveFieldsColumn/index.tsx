import ViewPlugins from "@/app/modules/Plugins/ViewPlugins";
import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import styled from "styled-components";
import AddField from "../../AddField";
import Pages from "../Pages";

const Container = styled(Box)`
  width: 100%;
  margin-top: -1rem;
`;

function InactiveFieldsColumnComponent() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");

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
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
      </AnimatePresence>
      <Container>
        <Box marginTop="2">
          <Stack>
            <ViewPlugins />
            <Pages />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default memo(InactiveFieldsColumnComponent);
