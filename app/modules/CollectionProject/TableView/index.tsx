import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack } from "degen";
import React from "react";
import TableView from "../../Collection/TableView";

export default function ProjectTableView() {
  return (
    <Box>
      <Stack direction="horizontal" align="baseline">
        <TableView />
        <PrimaryButton>Create Field</PrimaryButton>
      </Stack>
    </Box>
  );
}
