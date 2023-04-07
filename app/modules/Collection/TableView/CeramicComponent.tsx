import { smartTrim } from "@/app/common/utils/utils";
import { Box, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const CeramicComponent = ({ rowData }: CellProps) => (
  <Box padding="2">
    <a
      href={`https://cerscan.com/testnet-clay/stream/${rowData}`}
      target="_blank"
      rel="noreferrer"
    >
      <Text variant="small">{smartTrim(rowData, 20)}</Text>
    </a>
  </Box>
);

export default CeramicComponent;
