import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

type Props = {};

const DiscordComponent = ({ rowData, columnData }: CellProps) => {
  return (
    <Box padding="2">
      <Text variant="small">{rowData?.username}</Text>
    </Box>
  );
};

export default DiscordComponent;
