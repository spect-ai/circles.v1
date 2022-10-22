import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, IconEth, IconPlusSmall, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { CellProps } from "react-datasheet-grid";
import MilestoneModal from "../../PublicForm/MilestoneModal";

const MilestoneComponent = ({ rowData, columnData }: CellProps) => {
  const milestones = rowData[columnData.property.name];
  const id = rowData.id;

  return (
    <>
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
          justifyContent="flex-start"
          size="small"
          onClick={() => {
            columnData.setPropertyName(columnData.property.name);
            columnData.setDataId(id);
            columnData.setMultipleMilestoneModalOpen(true);
          }}
        >
          {milestones && milestones.length > 0 ? (
            <Text variant="small">{`${milestones.length} milestone${
              milestones.length > 1 ? "s" : ""
            }`}</Text>
          ) : (
            <Text variant="small">{"No milestones"}</Text>
          )}
        </Button>
      </Box>
    </>
  );
};

export default MilestoneComponent;
