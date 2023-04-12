import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const TelegramComponent = ({ rowData }: CellProps) => {
  return (
    <Box padding="2" cursor="pointer">
      <Text variant="small">{rowData?.username || rowData}</Text>
    </Box>
  );
};

export default TelegramComponent;
