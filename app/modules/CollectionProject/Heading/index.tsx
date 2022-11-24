import { Box, Heading } from "degen";
import React from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

export default function ProjectHeading() {
  const { localCollection: collection } = useLocalCollection();
  return (
    <Box padding="4">
      <Heading>{collection.name}</Heading>
    </Box>
  );
}
