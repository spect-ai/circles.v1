import { Box, Button, Text } from "degen";
import { CellProps } from "react-datasheet-grid";

const MilestoneComponent = ({ rowData, columnData }: CellProps) => {
  const milestones = rowData[columnData.property.name] || [];
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
        justifyContent="flex-start"
        size="small"
        onClick={() => {
          columnData.setPropertyName(columnData.property.name);
          columnData.setDataId(id);
          columnData.setMultipleMilestoneModalOpen(true);
        }}
      >
        {milestones && milestones.length > 0 ? (
          <Text variant="small">
            {`${milestones.length} milestone${
              milestones.length > 1 ? "s" : ""
            }`}
          </Text>
        ) : (
          <Text variant="small">No milestones</Text>
        )}
      </Button>
    </Box>
  );
};

export default MilestoneComponent;
