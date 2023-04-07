import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const GithubComponent = ({ rowData }: CellProps) => (
  <a href={rowData?.html_url} target="_blank" rel="noreferrer">
    <Box padding="2" cursor="pointer">
      <Text variant="small">{rowData?.login || rowData}</Text>
    </Box>
  </a>
);

export default GithubComponent;
