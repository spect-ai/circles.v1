import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box } from "degen";
import { CellProps } from "react-datasheet-grid";

export default function GutterColumnComponent({
  rowData,
  columnData,
}: CellProps) {
  return (
    <Box
      cursor="pointer"
      width="full"
      onClick={() => columnData.setExpandedDataSlug(rowData.id)}
    >
      {/* <Stack align="center" direction="horizontal" justify="center">
        <Text variant="label">{rowIndex + 1}</Text>
        <Text color="accent">
          <ExpandAltOutlined style={{ fontSize: "1.4rem" }} />
        </Text>
      </Stack> */}
      <PrimaryButton variant="transparent">Open</PrimaryButton>
    </Box>
  );
}
