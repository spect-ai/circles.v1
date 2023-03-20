import ViewPlugins from "@/app/modules/Plugins/ViewPlugins";
import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import styled from "styled-components";
import AddField from "../../AddField";
import Pages from "../Pages";

const Container = styled(Box)`
  width: 25%;
  @media (max-width: 992px) {
    width: 100%;
    margin-bottom: 2rem;
  }
  padding: 0rem;
  margin-top: -1rem;
`;

function InactiveFieldsColumnComponent() {
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [propertyName, setPropertyName] = useState("");

  return (
    <>
      <AnimatePresence>
        {isEditFieldOpen && (
          <AddField
            propertyName={propertyName}
            handleClose={() => setIsEditFieldOpen(false)}
          />
        )}
      </AnimatePresence>
      <Container>
        <Stack>
          <Box marginTop="2">
            <ViewPlugins />
          </Box>
          <Pages />
        </Stack>
      </Container>
    </>
  );
}

export default memo(InactiveFieldsColumnComponent);
