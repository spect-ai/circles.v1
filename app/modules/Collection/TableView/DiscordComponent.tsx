import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const DiscordComponent = ({ rowData }: CellProps) => (
  <Box padding="2">
    <Text variant="small">{rowData?.username || rowData}</Text>
  </Box>
);

export default DiscordComponent;
