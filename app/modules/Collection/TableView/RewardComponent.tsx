import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { IconEth } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const RewardComponent = ({ rowData, columnData }: CellProps) => {
  const reward = rowData[columnData.property.name];
  const id = rowData.id;
  return (
    <ClickableTag
      name={
        reward?.value ? `${reward.value} ${reward.token.symbol}` : "Set Reward"
      }
      icon={<IconEth color="accent" size="5" />}
      onClick={() => {
        columnData.setPropertyName(columnData.property.name);
        columnData.setDataId(id);
        columnData.setIsRewardFieldOpen(true);
      }}
    />
  );
};

export default RewardComponent;
