import {
  Box, Button, Stack, Text,
} from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const MultiURLComponent = ({ rowData, columnData }: CellProps) => {
  const urls = rowData[columnData.property.name];
  const { id } = rowData;
  return (
    <Box
      marginLeft="1"
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="full"
    >
      <Button
        variant="transparent"
        width="full"
        size="small"
        justifyContent="flex-start"
        onClick={() => {
          if (columnData.property.isPartOfFormView) return;
          columnData.setPropertyName(columnData.property.name);
          columnData.setDataId(id);
          columnData.setIsURLFieldOpen(true);
        }}
      >
        {urls?.length ? (
          <Stack direction="horizontal">
            <Text variant="small" ellipsis>
              {urls?.[0].label}
              {" "}
              -
            </Text>
            <Text variant="small" ellipsis>
              {urls?.[0].value}
            </Text>
          </Stack>
        ) : (
          <Text variant="small">No URLs</Text>
        )}
      </Button>
    </Box>
  );
};

export default MultiURLComponent;
