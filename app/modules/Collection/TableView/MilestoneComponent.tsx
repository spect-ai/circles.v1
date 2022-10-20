import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { Box, IconEth, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const milestones = [
  {
    id: "123",
    title: "test",
    description: "test",
    dueDate: new Date(),
    reward: {
      chain: {
        name: "Ethereum",
        chainId: 1,
      },
      token: {
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
      },
      value: 1,
    },
  },
];

const MilestoneComponent = ({ rowData, columnData }: CellProps) => {
  //const milestones = rowData[columnData.property.name];
  const id = rowData.id;
  console.log("adsdsd");
  return (
    <ClickableTag
      name={"Set Reward"}
      icon={<IconEth color="accent" size="5" />}
      onClick={() => {
        columnData.setPropertyName(columnData.property.name);
        columnData.setDataId(id);
        columnData.setIsRewardFieldOpen(true);
      }}
    />
  );
};

export default MilestoneComponent;
