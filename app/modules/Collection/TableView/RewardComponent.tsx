import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { IconEth } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";
import { useLocalCollection } from "../Context/LocalCollectionContext";

const RewardComponent = ({ rowData, columnData }: CellProps) => {
  const { localCollection: collection } = useLocalCollection();
  const reward =
    collection?.data[rowData] &&
    collection?.data[rowData][columnData.property.name];
  return (
    <ClickableTag
      name={
        reward?.value ? `${reward.value} ${reward.token.symbol}` : "Set Reward"
      }
      icon={<IconEth color="accent" size="5" />}
      onClick={() => {
        columnData.setPropertyName(columnData.property.name);
        columnData.setDataId(rowData);
        columnData.setIsRewardFieldOpen(true);
      }}
    />
  );
};

export default RewardComponent;
