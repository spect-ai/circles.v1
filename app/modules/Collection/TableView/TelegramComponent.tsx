import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const TelegramComponent = ({ rowData }: CellProps) => {
  console.log({ rowData });
  return (
    // <a href={rowData?.html_url} target="_blank" rel="noreferrer">
    <Box padding="2" cursor="pointer">
      <Text variant="small">{rowData?.username || rowData}</Text>
    </Box>
    // </a>
  );
};

export default TelegramComponent;
