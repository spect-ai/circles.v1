import { Box, Button, Text } from "degen";
import { CellProps } from "react-datasheet-grid";
import { Maximize2 } from "react-feather";

export default function GutterColumnComponent({
  rowData,
  columnData,
}: CellProps) {
  return (
    <Box cursor="pointer" width="full">
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => columnData.setExpandedDataSlug(rowData.id)}
      >
        <Text color="accent">
          <Maximize2 size={19} />
        </Text>
      </Button>
    </Box>
  );
}
