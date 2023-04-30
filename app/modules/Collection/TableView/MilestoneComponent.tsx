import { Box, Button, Text } from "degen";
import { CellProps } from "react-datasheet-grid";

const MilestoneComponent = ({ rowData, columnData }: CellProps) => {
  const milestones = rowData[columnData.property.id] || [];
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
            columnData.setPropertyId(columnData.property.id);
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
