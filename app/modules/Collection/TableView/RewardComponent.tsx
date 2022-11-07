import { Box, Button, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const RewardComponent = ({ rowData, columnData }: CellProps) => {
  const reward = rowData[columnData.property.name];
  const id = rowData.id;
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
          columnData.setIsRewardFieldOpen(true);
        }}
      >
        {reward?.value ? (
          <Text variant="small">{`${reward.value} ${reward.token?.label}`}</Text>
        ) : (
          <Text variant="small">{"No reward"}</Text>
        )}
      </Button>
    </Box>
  );
};

export default RewardComponent;
