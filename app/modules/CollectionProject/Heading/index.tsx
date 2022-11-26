import { Box, Heading, Stack } from "degen";
import React from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function ProjectHeading() {
  const { localCollection: collection } = useLocalCollection();
  return (
    <Box paddingX="8" paddingTop="4">
      <Stack direction="horizontal" justify="space-between">
        <Heading>{collection.name}</Heading>
      </Stack>
    </Box>
  );
}
